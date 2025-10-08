/* eslint-disable no-console */
import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
    // ----- Users (create first without orgId) -----
    const _users = await Promise.all([
        prisma.user.upsert({
            where: { id: 'e99335bd-9dd7-4260-8977-2eeaa4df799c' },
            update: {},
            create: {
                id: 'e99335bd-9dd7-4260-8977-2eeaa4df799c',
                name: 'Admin User',
                email: 'admin@techcorp.com',
            },
        }),
        prisma.user.upsert({
            where: { id: '68992d1e-e119-4874-b768-bf685d10194e' },
            update: {},
            create: {
                id: '68992d1e-e119-4874-b768-bf685d10194e',
                name: 'John Doe',
                email: 'john.doe@techcorp.com',
            },
        }),
        prisma.user.upsert({
            where: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            update: {},
            create: {
                id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                name: 'Jane Smith',
                email: 'jane.smith@startupxyz.com',
            },
        }),
        prisma.user.upsert({
            where: { id: 'b2c3d4e5-f6g7-8901-bcde-f12345678901' },
            update: {},
            create: {
                id: 'b2c3d4e5-f6g7-8901-bcde-f12345678901',
                name: 'Bob Wilson',
                email: 'bob.wilson@enterprise.com',
            },
        }),
    ]);

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

    console.log('Seed completed');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
