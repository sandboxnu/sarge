/* eslint-disable no-console */

import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`
  TRUNCATE TABLE
    "Comment",
    "Review",
    "Task",
    "Assessment",
    "TaskTemplate",
    "AssessmentTemplate",
    "CandidatePoolEntry",
    "Candidate",
    "Position",
    "Tag",
    "UserRole",
    "Role",
    "User",
    "Organization"
  RESTART IDENTITY CASCADE;
`;
  console.log("Development database cleared.");
}

main()
  .catch((e) => {
    console.error("Teardown failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
