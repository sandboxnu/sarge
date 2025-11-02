import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/better-auth';

async function main() {
    const seedUsers = [
        {
            id: 'e99335bd-9dd7-4260-8977-2eeaa4df799c',
            name: 'Admin User',
            email: 'admin@techcorp.com',
            password: 'password123',
        },
        {
            id: '68992d1e-e119-4874-b768-bf685d10194e',
            name: 'John Doe',
            email: 'john.doe@techcorp.com',
            password: 'password123',
        },
        {
            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            name: 'Jane Smith',
            email: 'jane.smith@startupxyz.com',
            password: 'password123',
        },
        {
            id: 'b2c3d4e5-f6g7-8901-bcde-f12345678901',
            name: 'Bob Wilson',
            email: 'bob.wilson@enterprise.com',
            password: 'password123',
        },
    ];

    // might have to update the session and account records to reference the new user ID (since better auth generates its own ID)

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

    // ----- Organizations -----
    // Each org must be "created" by a distinct user.
    const _orgs = await Promise.all([
        prisma.organization.upsert({
            where: { id: '788551fd-57e3-4854-87e5-8f7a5ff404f9' },
            update: {},
            create: {
                id: '788551fd-57e3-4854-87e5-8f7a5ff404f9',
                name: 'Tech Corp',
                createdById: 'e99335bd-9dd7-4260-8977-2eeaa4df799c',
            },
        }),
        prisma.organization.upsert({
            where: { id: '123e4567-e89b-12d3-a456-426614174000' },
            update: {},
            create: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'StartupXYZ',
                createdById: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            },
        }),
        prisma.organization.upsert({
            where: { id: '987fcdeb-51a2-43d1-9f12-0123456789ab' },
            update: {},
            create: {
                id: '987fcdeb-51a2-43d1-9f12-0123456789ab',
                name: 'Enterprise Solutions',
                createdById: 'b2c3d4e5-f6g7-8901-bcde-f12345678901',
            },
        }),
    ]);

    // ----- Assign users to orgs (set orgId now that orgs exist) -----
    await Promise.all([
        prisma.user.update({
            where: { id: 'e99335bd-9dd7-4260-8977-2eeaa4df799c' },
            data: { orgId: '788551fd-57e3-4854-87e5-8f7a5ff404f9' },
        }),
        prisma.user.update({
            where: { id: '68992d1e-e119-4874-b768-bf685d10194e' },
            data: { orgId: '788551fd-57e3-4854-87e5-8f7a5ff404f9' },
        }),
        prisma.user.update({
            where: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            data: { orgId: '123e4567-e89b-12d3-a456-426614174000' },
        }),
        prisma.user.update({
            where: { id: 'b2c3d4e5-f6g7-8901-bcde-f12345678901' },
            data: { orgId: '987fcdeb-51a2-43d1-9f12-0123456789ab' },
        }),
    ]);

    // ----- Positions -----
    await Promise.all([
        prisma.position.upsert({
            where: { id: 'pos-frontend-uuid-1234567890abcd' },
            update: {},
            create: {
                id: 'pos-frontend-uuid-1234567890abcd',
                title: 'Frontend Developer',
                orgId: '788551fd-57e3-4854-87e5-8f7a5ff404f9',
                tags: ['JavaScript', 'React', 'TypeScript'],
                createdBy: 'e99335bd-9dd7-4260-8977-2eeaa4df799c',
            },
        }),
        prisma.position.upsert({
            where: { id: 'pos-backend-uuid-1234567890abcde' },
            update: {},
            create: {
                id: 'pos-backend-uuid-1234567890abcde',
                title: 'Backend Developer',
                orgId: '788551fd-57e3-4854-87e5-8f7a5ff404f9',
                tags: ['Node.js', 'TypeScript', 'Database'],
                createdBy: 'e99335bd-9dd7-4260-8977-2eeaa4df799c',
            },
        }),
        prisma.position.upsert({
            where: { id: 'pos-fullstack-uuid-123456789abcd' },
            update: {},
            create: {
                id: 'pos-fullstack-uuid-123456789abcd',
                title: 'Full Stack Engineer',
                orgId: '123e4567-e89b-12d3-a456-426614174000',
                tags: ['JavaScript', 'Python', 'React', 'Node.js'],
                createdBy: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            },
        }),
        prisma.position.upsert({
            where: { id: 'pos-senior-uuid-1234567890abcdef' },
            update: {},
            create: {
                id: 'pos-senior-uuid-1234567890abcdef',
                title: 'Senior Software Engineer',
                orgId: '987fcdeb-51a2-43d1-9f12-0123456789ab',
                tags: ['Python', 'Senior', 'Remote'],
                createdBy: 'b2c3d4e5-f6g7-8901-bcde-f12345678901',
            },
        }),
    ]);

    // ----- Candidates -----
    await Promise.all([
        prisma.candidate.upsert({
            where: { id: 'cand-1' },
            update: {},
            create: {
                id: 'cand-1',
                name: 'Alice Candidate',
                email: 'alice@example.com',
                orgId: '788551fd-57e3-4854-87e5-8f7a5ff404f9',
            },
        }),
        prisma.candidate.upsert({
            where: { id: 'cand-2' },
            update: {},
            create: {
                id: 'cand-2',
                name: 'Evan Applicant',
                email: 'evan@example.com',
                orgId: '123e4567-e89b-12d3-a456-426614174000',
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
