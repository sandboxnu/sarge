import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';

async function main() {
    const seedUsers = [
        {
            id: 'clx00000000000000000000001',
            name: 'Admin User',
            email: 'admin@techcorp.com',
            password: 'password123',
        },
        {
            id: 'clx00000000000000000000002',
            name: 'John Doe',
            email: 'john.doe@techcorp.com',
            password: 'password123',
        },
        {
            id: 'clx00000000000000000000003',
            name: 'Jane Smith',
            email: 'jane.smith@startupxyz.com',
            password: 'password123',
        },
        {
            id: 'clx00000000000000000000004',
            name: 'Bob Wilson',
            email: 'bob.wilson@enterprise.com',
            password: 'password123',
        },
    ];

    const _users = await Promise.all(
        seedUsers.map(async (userData) => {
            const existingUser = await prisma.user.findUnique({
                where: { id: userData.id },
            });

            if (existingUser) {
                return existingUser;
            }

            await auth.api.signUpEmail({
                body: {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                },
            });

            const updatedUser = await prisma.user.update({
                where: { email: userData.email },
                data: {
                    id: userData.id,
                    emailVerified: true,
                },
            });

            return updatedUser;
        })
    );

    const orgConfigs = [
        {
            id: 'clx00000000000000000000011',
            name: 'Tech Corp',
            creatorId: 'clx00000000000000000000001',
            slug: 'tech-corp',
        },
        {
            id: 'clx00000000000000000000012',
            name: 'StartupXYZ',
            creatorId: 'clx00000000000000000000003',
            slug: 'startupxyz',
        },
        {
            id: 'clx00000000000000000000013',
            name: 'Enterprise Solutions',
            creatorId: 'clx00000000000000000000004',
            slug: 'enterprise-solutions',
        },
    ];

    const _orgs = await Promise.all(
        orgConfigs.map(async (orgConfig) => {
            const existingOrg = await prisma.organization.findUnique({
                where: { id: orgConfig.id },
            });

            if (existingOrg) {
                return existingOrg;
            }

            const createdOrg = await auth.api.createOrganization({
                body: {
                    name: orgConfig.name,
                    slug: orgConfig.slug,
                    userId: orgConfig.creatorId,
                },
            });

            if (!createdOrg) {
                throw new Error(`Failed to create organization: ${orgConfig.name}`);
            }

            // Update organization ID to match seed data (for consistent references)
            const updatedOrg = await prisma.organization.update({
                where: { id: createdOrg.id },
                data: {
                    id: orgConfig.id,
                },
            });

            return updatedOrg;
        })
    );

    try {
        await auth.api.addMember({
            body: {
                userId: 'clx00000000000000000000002',
                organizationId: 'clx00000000000000000000011',
                role: 'recruiter',
            },
        });
    } catch (error) {
        console.warn('Failed to add member (may already exist):', error);
    }

    const codingConcepts = [
        {
            id: 'clx00000000000000000000041',
            name: 'Frontend',
            colorHexCode: '#3B82F6',
        },
        {
            id: 'clx00000000000000000000042',
            name: 'Backend',
            colorHexCode: '#10B981',
        },
        {
            id: 'clx00000000000000000000043',
            name: 'Full Stack',
            colorHexCode: '#8B5CF6',
        },
    ];

    const _codingConcepts = await Promise.all(
        codingConcepts.map(async (codingConcept) => {
            return prisma.codingConcept.upsert({
                where: { id: codingConcept.id },
                update: {},
                create: {
                    id: codingConcept.id,
                    name: codingConcept.name,
                    colorHexCode: codingConcept.colorHexCode,
                },
            });
        })
    );

    // ----- Positions -----
    await Promise.all([
        prisma.position.upsert({
            where: { id: 'clx00000000000000000000021' },
            update: {},
            create: {
                id: 'clx00000000000000000000021',
                title: 'Frontend Developer',
                orgId: 'clx00000000000000000000011',
                createdById: 'clx00000000000000000000001',
                codingConcepts: {
                    connect: {
                        id: 'clx00000000000000000000041',
                    },
                },
            },
        }),
        prisma.position.upsert({
            where: { id: 'clx00000000000000000000022' },
            update: {},
            create: {
                id: 'clx00000000000000000000022',
                title: 'Backend Developer',
                orgId: 'clx00000000000000000000011',
                createdById: 'clx00000000000000000000001',
                codingConcepts: {
                    connect: {
                        id: 'clx00000000000000000000042',
                    },
                },
            },
        }),
        prisma.position.upsert({
            where: { id: 'clx00000000000000000000023' },
            update: {},
            create: {
                id: 'clx00000000000000000000023',
                title: 'Full Stack Engineer',
                orgId: 'clx00000000000000000000012',
                createdById: 'clx00000000000000000000003',
                codingConcepts: {
                    connect: {
                        id: 'clx00000000000000000000043',
                    },
                },
            },
        }),
        prisma.position.upsert({
            where: { id: 'clx00000000000000000000024' },
            update: {},
            create: {
                id: 'clx00000000000000000000024',
                title: 'Senior Software Engineer',
                orgId: 'clx00000000000000000000013',
                createdById: 'clx00000000000000000000004',
                codingConcepts: {
                    connect: [
                        { id: 'clx00000000000000000000041' },
                        { id: 'clx00000000000000000000042' },
                        { id: 'clx00000000000000000000043' },
                    ],
                },
            },
        }),
    ]);

    // ----- Candidates -----
    await Promise.all([
        prisma.candidate.upsert({
            where: { id: 'clx00000000000000000000031' },
            update: {},
            create: {
                id: 'clx00000000000000000000031',
                name: 'Alice Candidate',
                email: 'alice@example.com',
                orgId: 'clx00000000000000000000011',
            },
        }),
        prisma.candidate.upsert({
            where: { id: 'clx00000000000000000000032' },
            update: {},
            create: {
                id: 'clx00000000000000000000032',
                name: 'Evan Applicant',
                email: 'evan@example.com',
                orgId: 'clx00000000000000000000012',
            },
        }),
    ]);

    // ----- TaskTemplates -----
    await Promise.all([
        prisma.taskTemplate.upsert({
            where: { id: 'tasktemplate-1' },
            update: {},
            create: {
                id: 'tasktemplate-1',
                title: 'Add Two Numbers',
                content: `# Add Two Numbers

## Problem Description

Write a function that takes two integers as input and returns their sum.

## Input Format

The input consists of two lines:
- First line: an integer \`a\`
- Second line: an integer \`b\`

## Output Format

Output a single integer representing the sum of \`a\` and \`b\`.

## Constraints

- \`-1000 ≤ a, b ≤ 1000\`

## Example

### Input
\`\`\`
2
3
\`\`\`

### Output
\`\`\`
5
\`\`\`

## Implementation Notes

- Read two integers from standard input
- Calculate their sum
- Print the result to standard output`,
                orgId: '788551fd-57e3-4854-87e5-8f7a5ff404f9',
                public_test_cases: [
                    { input: '2\n3\n', output: '5\n' },
                    { input: '10\n20\n', output: '30\n' },
                ],
                private_test_cases: [
                    { input: '1\n1\n', output: '2\n' },
                    { input: '5\n5\n', output: '10\n' },
                    { input: '-5\n3\n', output: '-2\n' },
                    { input: '0\n0\n', output: '0\n' },
                ],
            },
        }),
        prisma.taskTemplate.upsert({
            where: { id: 'tasktemplate-2' },
            update: {},
            create: {
                id: 'tasktemplate-2',
                title: 'Find GCD of Two Numbers',
                content: `# Find GCD of Two Numbers

## Problem Description

Write a function that takes two integers as input and returns their greatest common divisor (GCD).

## Input Format

The input consists of two lines:
- First line: an integer \`a\`
- Second line: an integer \`b\`

## Output Format

Output a single integer representing the GCD of \`a\` and \`b\`.

## Constraints

- \`1 ≤ a, b ≤ 10^6\`

## Example

### Input
\`\`\`
12
15
\`\`\`

### Output
\`\`\`
3
\`\`\`

## Implementation Notes

- Read two integers from standard input
- Calculate their GCD
- Print the result to standard output`,
                orgId: '123e4567-e89b-12d3-a456-426614174000',
                public_test_cases: [
                    { input: '12\n15\n', output: '3\n' },
                    { input: '100\n80\n', output: '20\n' },
                ],
                private_test_cases: [
                    { input: '7\n5\n', output: '1\n' },
                    { input: '20\n30\n', output: '10\n' },
                    { input: '81\n27\n', output: '27\n' },
                    { input: '17\n19\n', output: '1\n' },
                ],
            },
        }),
    ]);
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
