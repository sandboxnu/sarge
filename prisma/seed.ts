import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { organizationsData } from './seed-data/organizations.seed';
import { usersData } from './seed-data/users.seed';
import { positionsData } from './seed-data/positions.seed';
import { candidatesData } from './seed-data/candidates.seed';
import { taskTemplatesData } from './seed-data/task-template.seed';
import { assessmentTemplatesData } from './seed-data/assessment-template.seed';
import { assessmentsData } from './seed-data/assessment.seed';
import { tagsData } from './seed-data/tags.seed';
import { languageData } from './seed-data/languages.seed';

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
 * Seed Languages for Task Templates
 */
async function seedLanguages() {
    console.log('Seeding task template languages...');

    for (const language of languageData) {
        const existing = await prisma.taskTemplateLanguage.findFirst({
            where: {
                taskTemplateId: language.taskTemplateId,
                language: language.language as any,
            },
        });

        if (existing) {
            console.log(
                `  Language ${language.language} for task template ${language.taskTemplateId} already exists`
            );
            continue;
        }

        await prisma.taskTemplateLanguage.create({
            data: {
                taskTemplateId: language.taskTemplateId,
                language: language.language as any,
                stub: language.stub,
                solution: language.solution,
            },
        });

        console.log(
            `  Created ${language.language} language for task template: ${language.taskTemplateId}`
        );
    }
}

/**
 * Seed Tags
 */
async function seedTags() {
    console.log('Seeding tags...');

    for (const tag of tagsData) {
        await prisma.tag.upsert({
            where: { id: tag.id },
            update: {},
            create: tag,
        });

        console.log(`  Created tag: ${tag.name}`);
    }

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[0].id },
        data: {
            tags: {
                connect: tagsData.map((tag) => ({ id: tag.id })),
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[1].id },
        data: {
            tags: {
                connect: [{ id: tagsData[0].id }, { id: tagsData[1].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[2].id },
        data: {
            tags: {
                connect: [{ id: tagsData[2].id }, { id: tagsData[0].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[3].id },
        data: {
            tags: {
                connect: [{ id: tagsData[3].id }, { id: tagsData[4].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[5].id },
        data: {
            tags: {
                connect: [{ id: tagsData[0].id }, { id: tagsData[3].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[6].id },
        data: {
            tags: {
                connect: [{ id: tagsData[0].id }, { id: tagsData[1].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[7].id },
        data: {
            tags: {
                connect: [{ id: tagsData[1].id }, { id: tagsData[0].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[8].id },
        data: {
            tags: {
                connect: [{ id: tagsData[1].id }, { id: tagsData[0].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[9].id },
        data: {
            tags: {
                connect: [{ id: tagsData[0].id }, { id: tagsData[1].id }],
            },
        },
    });
}

/**
 * Seed Assessment Templates
 */
async function seedAssessmentTemplates() {
    console.log('Seeding assessment templates...');

    const orgId = organizationsData[0].id;

    for (const assessmentTemplateData of assessmentTemplatesData) {
        const taskTemplateIds = assessmentTemplateData.taskTemplates;
        const tasksCreate = taskTemplateIds.map((taskTemplateId, index) => ({
            taskTemplateId,
            order: index,
        }));

        await prisma.assessmentTemplate.upsert({
            where: { id: assessmentTemplateData.id },
            update: {
                tasks: {
                    deleteMany: {},
                    create: tasksCreate,
                },
            },
            create: {
                id: assessmentTemplateData.id,
                title: assessmentTemplateData.title,
                orgId,
                tasks: { create: tasksCreate },
                authorId: assessmentTemplateData.authorId,
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

    for (let i = 0; i < assessmentsData.length; i++) {
        const assessmentData = assessmentsData[i];
        const application = applications[i];

        await prisma.assessment.upsert({
            where: { applicationId: application.id },
            update: {
                assessmentTemplateId: assessmentData.assessmentTemplateId,
                uniqueLink: assessmentData.uniqueLink,
                deadline: assessmentData.deadline,
            },
            create: {
                id: assessmentData.id,
                applicationId: application.id,
                assessmentTemplateId: assessmentData.assessmentTemplateId,
                uniqueLink: assessmentData.uniqueLink,
                deadline: assessmentData.deadline,
            },
        });

        console.log(`  Created assessment for application: ${application.id}`);
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
    await seedLanguages();
    await seedTags();
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
