import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { allTracks } from "../src/lib/tracks";

const db = new PrismaClient();

async function main() {
  for (const track of allTracks) {
    const existing = await db.track.findUnique({ where: { slug: track.slug } });
    if (existing) continue;

    await db.track.create({
      data: {
        slug: track.slug,
        title: track.title,
        description: track.description,
        theme: track.theme,
        stations: {
          create: track.stations.map((s) => ({
            order: s.order,
            type: s.type,
            title: s.title,
            config: JSON.stringify(s.config),
          })),
        },
      },
    });
    console.log(`Seeded track: ${track.title}`);
  }

  const demoEmail = "demo@auctor.bh";
  const existingCompany = await db.company.findUnique({ where: { email: demoEmail } });
  if (!existingCompany) {
    const passwordHash = await bcrypt.hash("auctor-demo", 10);
    const company = await db.company.create({
      data: {
        name: "AUCTOR Demo Co.",
        email: demoEmail,
        passwordHash,
        credits: { create: { assessmentsRemaining: 50 } },
      },
    });
    console.log(`Seeded demo company: ${company.email} (password: auctor-demo)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
