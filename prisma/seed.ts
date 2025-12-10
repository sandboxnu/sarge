import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { organizationsData } from './seed-data/organizations.seed';
import { usersData } from './seed-data/users.seed';
import { positionsData } from './seed-data/positions.seed';
import { candidatesData } from './seed-data/candidates.seed';

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

        // Update organization ID to match seed data
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

        // Update user ID and verify email
        const updatedUser = await prisma.user.update({
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
        try {
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

            console.log(`  Added ${userData.name} to organization with role: ${userData.role}`);
        } catch (error) {
            console.warn(`  ! Failed to add member ${userData.name}:`, error);
        }
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
            where: {
                id: candidateData.id,
            },
            update: {},
            create: candidateData,
        });

        console.log(`  Created candidate: ${candidateData.name}`);
    }
}

/**
 * Seed Candidate Pool Entries
 * Links candidates to positions
 */
async function seedCandidatePoolEntries() {
    console.log('Seeding candidate pool entries...');

    const positionId = positionsData[0].id;

    for (const candidateData of candidatesData) {
        await prisma.candidatePoolEntry.upsert({
            where: {
                candidateId_positionId: {
                    candidateId: candidateData.id,
                    positionId: positionId,
                },
            },
            update: {},
            create: {
                candidateId: candidateData.id,
                positionId: positionId,
                assessmentStatus: 'NOT_ASSIGNED',
                decisionStatus: 'PENDING',
            },
        });

        console.log(`  Added ${candidateData.name} to position pool`);
    }
}

/**
 * Main seeding function
 */
async function main() {
    console.log('Starting database seeding...\n');

    try {
        // Seed in order: users first (owner needed for org creation), then org, then memberships, then rest
        await seedUsers();
        await seedOrganizations();
        await seedOrganizationMemberships();
        await seedPositions();
        await seedCandidates();
        await seedCandidatePoolEntries();

        console.log('\nDatabase seeding completed successfully!');
    } catch (error) {
        console.error('\nSeeding failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
