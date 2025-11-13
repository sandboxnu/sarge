import { prisma } from '@/lib/prisma';

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
    "User",
    "Organization",
    "Session",
    "Account",
    "Verification",
    "Member",
    "Invitation",
    "_TaskTemplateTags"
  RESTART IDENTITY CASCADE;
`;
}

main()
    .catch((e) => {
        console.error('Teardown failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
