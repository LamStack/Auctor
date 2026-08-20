import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { getInviteByToken } from "@/lib/sessionAccess";
import { CodeIdeConfig } from "@/lib/stationTypes";

const schema = z.object({
  message: z.string().min(1).max(2000),
  code: z.string().max(20000),
  languageLabel: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: { token: string; stationId: string } }
) {
  const invite = await getInviteByToken(params.token);
  if (!invite || !invite.session) {
    return NextResponse.json({ error: "Session not started" }, { status: 404 });
  }

  const station = invite.track.stations.find((s) => s.id === params.stationId);
  if (!station || station.type !== "code-ide") {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      reply: "The AI assistant isn't available right now, but you can still write and run your code normally.",
    });
  }

  const config = JSON.parse(station.config) as CodeIdeConfig;

  const priorMessages = await db.chatMessage.findMany({
    where: { sessionId: invite.session.id, stationId: station.id },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  await db.chatMessage.create({
    data: { sessionId: invite.session.id, stationId: station.id, role: "user", content: body.data.message },
  });

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 700,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      system: `You are a helpful coding assistant embedded in AUCTOR, a hiring assessment platform. A candidate is working on this problem in ${body.data.languageLabel}:\n\n${config.prompt}\n\nHelp them with syntax, debugging, and general coding questions the same way a supportive senior developer would. You may explain concepts and point out bugs, but let them write and fix the code themselves rather than dictating a full solution verbatim.`,
      messages: [
        ...priorMessages.map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.content,
        })),
        {
          role: "user",
          content: `My current code:\n\`\`\`${body.data.languageLabel}\n${body.data.code}\n\`\`\`\n\nQuestion: ${body.data.message}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && textBlock.type === "text" ? textBlock.text : "Sorry, I couldn't generate a reply.";

    await db.chatMessage.create({
      data: { sessionId: invite.session.id, stationId: station.id, role: "assistant", content: reply },
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Coding chat failed:", err);
    return NextResponse.json({ reply: "The assistant hit an error. Try asking again in a moment." });
  }
}
