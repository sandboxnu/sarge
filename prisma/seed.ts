import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { organizationsData } from './seed-data/organizations.seed';
import { usersData } from './seed-data/users.seed';
import { positionsData } from './seed-data/positions.seed';
import { candidatesData } from './seed-data/candidates.seed';
import { taskTemplatesData } from './seed-data/task-template.seed';
import { assessmentTemplatesData } from './seed-data/assessment-template.seed';
import { assessmentsData } from './seed-data/assessment.seed';

/**
 * Seed Organizations
 */
async function seedOrganizations() {
    console.log('Seeding organizations...');

    for (const orgData of organizationsData) {
        const existingOrg = await prisma.organization.findUnique({
            where: { id: orgData.id },
        });

        if (existingOrg) {
            console.log(`  Organization "${orgData.name}" already exists`);
            continue;
        }

        const ownerUser = usersData.find((u) => u.role === 'owner');
        if (!ownerUser) {
            throw new Error('No owner user found in seed data');
        }

        const createdOrg = await auth.api.createOrganization({
            body: {
                name: orgData.name,
                slug: orgData.slug,
                userId: ownerUser.id,
            },
        });

        if (!createdOrg) {
            throw new Error(`Failed to create organization: ${orgData.name}`);
        }

        await prisma.organization.update({
            where: { id: createdOrg.id },
            data: {
                id: orgData.id,
                logo: orgData.logo,
            },
        });

        console.log(`  Created organization: ${orgData.name}`);
    }
}

/**
 * Seed Users
 */
async function seedUsers() {
    console.log('Seeding users...');

    for (const userData of usersData) {
        const existingUser = await prisma.user.findUnique({
            where: { id: userData.id },
        });

        if (existingUser) {
            console.log(`  User "${userData.name}" already exists`);
            continue;
        }

        await auth.api.signUpEmail({
            body: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            },
        });

        await prisma.user.update({
            where: { email: userData.email },
            data: {
                id: userData.id,
                emailVerified: true,
            },
        });

        console.log(`  Created user: ${userData.name}`);
    }
}

/**
 * Seed Organization Memberships
 */
async function seedOrganizationMemberships() {
    console.log('Seeding organization memberships...');

    const orgId = organizationsData[0].id;

    for (const userData of usersData) {
        const existingMember = await prisma.member.findUnique({
            where: {
                userId_organizationId: {
                    userId: userData.id,
                    organizationId: orgId,
                },
            },
        });

        if (existingMember) {
            console.log(`  User "${userData.name}" already member of organization`);
            continue;
        }

        await auth.api.addMember({
            body: {
                userId: userData.id,
                organizationId: orgId,
                role: userData.role,
            },
        });

        console.log(`  Added ${userData.name} to organization`);
    }
}

/**
 * Seed Positions
 */
async function seedPositions() {
    console.log('Seeding positions...');

    for (const positionData of positionsData) {
        await prisma.position.upsert({
            where: { id: positionData.id },
            update: {},
            create: positionData,
        });

        console.log(`  Created position: ${positionData.title}`);
    }
}

/**
 * Seed Candidates
 */
async function seedCandidates() {
    console.log('Seeding candidates...');

    for (const candidateData of candidatesData) {
        await prisma.candidate.upsert({
            where: { id: candidateData.id },
            update: {},
            create: candidateData,
        });

        console.log(`  Created candidate: ${candidateData.name}`);
    }
}

/**
 * Seed Applications (was CandidatePoolEntry)
 * Links candidates to positions
 */
async function seedApplications() {
    console.log('Seeding applications...');

    const positionId = positionsData[0].id;

    for (const candidateData of candidatesData) {
        await prisma.application.upsert({
            where: {
                candidateId_positionId: {
                    candidateId: candidateData.id,
                    positionId,
                },
            },
            update: {},
            create: {
                candidateId: candidateData.id,
                positionId,
                assessmentStatus: 'NOT_ASSIGNED',
                decisionStatus: 'PENDING',
            },
        });

        console.log(`  Created application for ${candidateData.name}`);
    }
}

/**
 * Seed Task Templates
 */
async function seedTaskTemplates() {
    console.log('Seeding task templates...');

    for (const taskTemplateData of taskTemplatesData) {
        await prisma.taskTemplate.upsert({
            where: { id: taskTemplateData.id },
            update: {},
            create: taskTemplateData,
        });

        console.log(`  Created task template: ${taskTemplateData.title}`);
    }
}

/**
 * Seed Assessment Templates
 */
async function seedAssessmentTemplates() {
    console.log('Seeding assessment templates...');

    const orgId = organizationsData[0].id;

    for (const assessmentTemplateData of assessmentTemplatesData) {
        await prisma.assessmentTemplate.upsert({
            where: { id: assessmentTemplateData.id },
            update: {},
            create: {
                id: assessmentTemplateData.id,
                title: assessmentTemplateData.title,
                description: assessmentTemplateData.description,
                orgId,
            },
        });

        console.log(`  Created assessment template: ${assessmentTemplateData.title}`);
    }
}

/**
 * Seed Assessments
 */
async function seedAssessments() {
    console.log('Seeding assessments...');

    const applications = await prisma.application.findMany();

    for (const assessmentData of assessmentsData) {
        const randomApplication = applications[Math.floor(Math.random() * applications.length)];

        await prisma.assessment.upsert({
            where: { id: assessmentData.id },
            update: {},
            create: {
                id: assessmentData.id,
                applicationId: randomApplication.id,
                assessmentTemplateId: assessmentData.assessmentTemplateId,
                uniqueLink: assessmentData.uniqueLink,
                deadline: assessmentData.deadline,
            },
        });

        console.log(`  Created assessment: ${assessmentData.id}`);
    }
}

/**
 * Main seeding function
 */
async function main() {
    console.log('Starting database seeding...\n');

    await seedUsers();
    await seedOrganizations();
    await seedOrganizationMemberships();
    await seedPositions();
    await seedCandidates();
    await seedApplications();
    await seedTaskTemplates();
    await seedAssessmentTemplates();
    await seedAssessments();

    console.log('\nDatabase seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
