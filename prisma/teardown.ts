import { prisma } from '@/lib/prisma';

/**
 * Teardown script to clean the database
 * Truncates all tables and restarts identity sequences
 */
async function main() {
    console.log('Starting database teardown...\n');

    try {
        console.log('Truncating all tables...');

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
                "Member",
                "Invitation",
                "Session",
                "Account",
                "Verification",
                "User",
                "Organization",
                "_TaskTemplateTags"
            RESTART IDENTITY CASCADE;
        `;

        console.log('All tables truncated successfully');
        console.log('Identity sequences restarted');
        console.log('\nDatabase teardown completed successfully!');
    } catch (error) {
        console.error('\nTeardown failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Teardown failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
