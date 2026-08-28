import { Resend } from "resend";

const DEFAULT_TEMPLATE = `Hi {{name}},

Congrats on completing the {{role}} assessment with {{company}}! 🏆

Your AUCTOR score: {{score}}/100

We'll be reviewing results and will be in touch about next steps, which may include an interview.

Thanks for taking the time to play through it!`;

function renderTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] ?? match);
}

export async function sendResultsEmail(params: {
  to: string;
  candidateName: string;
  companyName: string;
  roleLabel: string;
  overall: number;
  emailTemplate: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set — skipping results email to", params.to);
    return { sent: false };
  }

  const vars = {
    name: params.candidateName,
    company: params.companyName,
    role: params.roleLabel,
    score: String(params.overall),
  };

  const body = renderTemplate(params.emailTemplate?.trim() || DEFAULT_TEMPLATE, vars);

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "AUCTOR <onboarding@resend.dev>",
      to: params.to,
      subject: `Congrats! 🎉 Your ${params.companyName} assessment results`,
      text: body,
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send results email:", err);
    return { sent: false };
  }
}

export async function sendInviteEmail(params: {
  to: string;
  candidateName: string | null;
  companyName: string;
  roleLabel: string;
  playUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set — skipping invite email to", params.to);
    return { sent: false };
  }

  const greeting = params.candidateName ? `Hi ${params.candidateName},` : "Hi,";
  const body = `${greeting}

${params.companyName} has invited you to complete a short skills assessment for the ${params.roleLabel} role, built on AUCTOR.

Start here: ${params.playUrl}

It's a quick, interactive assessment — you'll be guided through everything once you open the link.`;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "AUCTOR <onboarding@resend.dev>",
      to: params.to,
      subject: `You've been invited to a ${params.roleLabel} assessment`,
      text: body,
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send invite email:", err);
    return { sent: false };
  }
}

export { DEFAULT_TEMPLATE };
