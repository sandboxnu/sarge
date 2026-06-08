import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { organizationsData } from './seed-data/organizations.seed';
import { usersData } from './seed-data/users.seed';
import { invitationsSeedData } from './seed-data/invitations.seed';
import { positionsData } from './seed-data/positions.seed';
import { candidatesData } from './seed-data/candidates.seed';
import { taskTemplatesData } from './seed-data/task-template.seed';
import { assessmentTemplatesData } from './seed-data/assessment-template.seed';
import { assessmentsData } from './seed-data/assessment.seed';
import { positionTagsData } from './seed-data/position-tags.seed';
import { taskTemplateTagsData } from './seed-data/task-template-tags.seed';
import { languageData } from './seed-data/languages.seed';
import { tasksData } from './seed-data/tasks.seed';
import { reviewsData } from './seed-data/reviews.seed';
import { commentsData } from './seed-data/comments.seed';
import { snapshotsData } from './seed-data/snapshots.seed';

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

async function seedInvitations() {
    console.log('Seeding invitations...');

    for (const row of invitationsSeedData) {
        await prisma.invitation.upsert({
            where: { id: row.id },
            update: {
                email: row.email,
                role: row.role,
                status: row.status,
                expiresAt: row.expiresAt,
                createdAt: row.createdAt,
                inviterId: row.inviterId,
            },
            create: row,
        });
        console.log(`  Upserted invitation for ${row.email}`);
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

    for (const tag of taskTemplateTagsData) {
        await prisma.taskTemplateTag.upsert({
            where: { id: tag.id },
            update: {},
            create: tag,
        });

        console.log(`  Created task template tag: ${tag.name}`);
    }

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[0].id },
        data: {
            tags: {
                connect: taskTemplateTagsData.map((tag) => ({ id: tag.id })),
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[1].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[0].id }, { id: taskTemplateTagsData[1].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[2].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[2].id }, { id: taskTemplateTagsData[0].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[3].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[3].id }, { id: taskTemplateTagsData[4].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[5].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[0].id }, { id: taskTemplateTagsData[3].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[6].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[0].id }, { id: taskTemplateTagsData[1].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[7].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[1].id }, { id: taskTemplateTagsData[0].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[8].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[1].id }, { id: taskTemplateTagsData[0].id }],
            },
        },
    });

    await prisma.taskTemplate.update({
        where: { id: taskTemplatesData[9].id },
        data: {
            tags: {
                connect: [{ id: taskTemplateTagsData[0].id }, { id: taskTemplateTagsData[1].id }],
            },
        },
    });

    for (const tag of positionTagsData) {
        await prisma.positionTag.upsert({
            where: { id: tag.id },
            update: {},
            create: tag,
        });

        console.log(`  Created position tag: ${tag.name}`);
    }

    await prisma.position.update({
        where: { id: positionsData[0].id },
        data: {
            tags: {
                connect: [{ id: positionTagsData[0].id }, { id: positionTagsData[1].id }],
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
                ...('notes' in assessmentTemplateData && {
                    notes: assessmentTemplateData.notes,
                }),
            },
            create: {
                id: assessmentTemplateData.id,
                title: assessmentTemplateData.title,
                orgId,
                tasks: { create: tasksCreate },
                authorId: assessmentTemplateData.authorId,
                ...('notes' in assessmentTemplateData && {
                    notes: assessmentTemplateData.notes,
                }),
            },
        });

        console.log(`  Created assessment template: ${assessmentTemplateData.title}`);
    }
}

/**
 * Seed Assessments
 *
 * Each row in `assessmentsData` targets a specific candidate's Application
 * and carries the reviewers + the resulting Application.assessmentStatus.
 */
async function seedAssessments() {
    console.log('Seeding assessments...');

    const positionId = positionsData[0].id;

    for (const assessmentData of assessmentsData) {
        const application = await prisma.application.findUnique({
            where: {
                candidateId_positionId: {
                    candidateId: assessmentData.candidateId,
                    positionId,
                },
            },
        });

        if (!application) {
            throw new Error(
                `No application found for candidate ${assessmentData.candidateId} on position ${positionId}`
            );
        }

        const reviewersConnect = assessmentData.reviewerIds.map((id) => ({ id }));

        await prisma.assessment.upsert({
            where: { applicationId: application.id },
            update: {
                assessmentTemplateId: assessmentData.assessmentTemplateId,
                assignedAt: assessmentData.assignedAt,
                submittedAt: assessmentData.submittedAt,
                deadline: assessmentData.deadline,
                reviewers: {
                    set: reviewersConnect,
                },
            },
            create: {
                id: assessmentData.id,
                applicationId: application.id,
                assessmentTemplateId: assessmentData.assessmentTemplateId,
                assignedAt: assessmentData.assignedAt,
                submittedAt: assessmentData.submittedAt,
                deadline: assessmentData.deadline,
                reviewers: {
                    connect: reviewersConnect,
                },
            },
        });

        await prisma.application.update({
            where: { id: application.id },
            data: { assessmentStatus: assessmentData.applicationStatus },
        });

        console.log(
            `  Seeded assessment ${assessmentData.id} (status: ${assessmentData.applicationStatus}, ${reviewersConnect.length} reviewer(s))`
        );
    }
}

/**
 * Seed Tasks (candidate submissions)
 */
async function seedTasks() {
    console.log('Seeding task submissions...');

    for (const taskData of tasksData) {
        await prisma.task.upsert({
            where: { id: taskData.id },
            update: {
                submission: taskData.submission,
                language: taskData.language,
                startedAt: taskData.startedAt,
                submittedAt: taskData.submittedAt,
                testResults: {
                    deleteMany: {},
                    create: taskData.testResults,
                },
            },
            create: {
                id: taskData.id,
                assessmentId: taskData.assessmentId,
                taskTemplateId: taskData.taskTemplateId,
                submission: taskData.submission,
                language: taskData.language,
                startedAt: taskData.startedAt,
                submittedAt: taskData.submittedAt,
                testResults: {
                    create: taskData.testResults,
                },
            },
        });

        console.log(`  Upserted task submission: ${taskData.id}`);
    }
}

/**
 * Seed Reviews
 */
async function seedReviews() {
    console.log('Seeding reviews...');

    for (const reviewData of reviewsData) {
        await prisma.review.upsert({
            where: { id: reviewData.id },
            update: {
                score: reviewData.score,
                updatedAt: reviewData.updatedAt,
            },
            create: reviewData,
        });

        console.log(`  Upserted review: ${reviewData.id}`);
    }
}

/**
 * Seed Comments
 */
async function seedComments() {
    console.log('Seeding review comments...');

    for (const commentData of commentsData) {
        await prisma.comment.upsert({
            where: { id: commentData.id },
            update: {
                startLine: commentData.startLine,
                endLine: commentData.endLine,
                content: commentData.content,
            },
            create: commentData,
        });

        console.log(`  Upserted comment: ${commentData.id}`);
    }
}

/**
 * Seed Snapshots (assessment activity history)
 */
async function seedSnapshots() {
    console.log('Seeding task snapshots...');

    for (const snapshotData of snapshotsData) {
        await prisma.snapshot.upsert({
            where: { id: snapshotData.id },
            update: {
                type: snapshotData.type,
                // null out content on non-CONTENT rows so the CHECK constraint holds.
                content: snapshotData.content ?? null,
                createdAt: snapshotData.createdAt,
            },
            create: snapshotData,
        });
    }

    console.log(`  Upserted ${snapshotsData.length} snapshots`);
}

/**
 * Main seeding function
 */
async function main() {
    console.log('Starting database seeding...\n');

    await seedUsers();
    await seedOrganizations();
    await seedOrganizationMemberships();
    await seedInvitations();
    await seedPositions();
    await seedCandidates();
    await seedApplications();
    await seedTaskTemplates();
    await seedLanguages();
    await seedTags();
    await seedAssessmentTemplates();
    await seedAssessments();
    await seedTasks();
    await seedReviews();
    await seedComments();
    await seedSnapshots();

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
