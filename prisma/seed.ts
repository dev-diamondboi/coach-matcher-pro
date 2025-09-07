import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("Admin123!", 10);
  const coachPass = await bcrypt.hash("Coach123!", 10);
  const clientPass = await bcrypt.hash("Client123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@coach.test" },
    update: {},
    create: {
      email: "admin@coach.test",
      password: adminPass,
      name: "Admin",
      role: Role.ADMIN,
      timezone: "America/Toronto"
    }
  });

  // sample coaches
  const c1User = await prisma.user.create({
    data: {
      email: "coach1@coach.test",
      password: coachPass,
      name: "Ava Mentor",
      role: Role.COACH,
      timezone: "America/New_York",
      coachProfile: {
        create: {
          bio: "ICF-certified leadership coach focused on tech managers.",
          specialties: "Leadership, Career, Communication",
          certifications: "ICF PCC",
          languages: "English",
          timezone: "America/New_York",
          pricePerHour: 150,
          formats: "1-1, workshop",
          availability: {
            create: [
              { dayOfWeek: 1, startMins: 9*60, endMins: 12*60 },
              { dayOfWeek: 3, startMins: 13*60, endMins: 17*60 },
            ]
          }
        }
      }
    }
  });

  const c2User = await prisma.user.create({
    data: {
      email: "coach2@coach.test",
      password: coachPass,
      name: "Ben Clarity",
      role: Role.COACH,
      timezone: "America/Los_Angeles",
      coachProfile: {
        create: {
          bio: "Performance coach blending CBT tools and productivity systems.",
          specialties: "Productivity, Mindset, Stress",
          certifications: "CPC",
          languages: "English, Spanish",
          timezone: "America/Los_Angeles",
          pricePerHour: 120,
          formats: "1-1, group",
          availability: {
            create: [
              { dayOfWeek: 2, startMins: 10*60, endMins: 14*60 },
              { dayOfWeek: 4, startMins: 9*60, endMins: 12*60 },
            ]
          }
        }
      }
    }
  });

  // sample client
  const client = await prisma.user.create({
    data: {
      email: "client@coach.test",
      password: clientPass,
      name: "Taylor Client",
      role: Role.CLIENT,
      timezone: "America/Toronto",
      clientProfile: {
        create: {
          goals: "Improve leadership and communication as a new manager",
          languages: "English",
          budgetMin: 80,
          budgetMax: 160
        }
      }
    }
  });

  console.log({ admin, c1User, c2User, client });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
