import { prisma } from '@/lib/prisma';
import { NotFoundException, ForbiddenException } from '@/lib/utils/errors.utils';
import { type AddCandidateWithDataDTO } from '@/lib/schemas/candidate-pool.schema';
import type { BatchAddResult, CandidatePoolDisplayInfo } from '@/lib/types/position.types';
import type { CandidatePoolEntry, AssessmentStatus } from '@/generated/prisma';

async function validatePositionAccess(positionId: string, orgId: string) {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        select: { id: true, orgId: true },
    });

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    if (position.orgId !== orgId) {
        throw new ForbiddenException('Position does not belong to your organization');
    }

    return position;
}

/**
 * Add a single candidate to a position (create candidate if not exists)
 *
 */
async function addCandidateToPosition(
    candidateData: AddCandidateWithDataDTO,
    positionId: string,
    orgId: string
): Promise<CandidatePoolEntry> {
    await validatePositionAccess(positionId, orgId);

    const entry = await prisma.candidatePoolEntry.create({
        data: {
            position: { connect: { id: positionId } },
            candidate: {
                connectOrCreate: {
                    where: {
                        email_orgId: {
                            email: candidateData.email,
                            orgId,
                        },
                    },
                    create: {
                        name: candidateData.name,
                        email: candidateData.email,
                        orgId,
                        linkedinUrl: candidateData.linkedinUrl,
                        githubUrl: candidateData.githubUrl,
                        major: candidateData.major,
                        graduationDate: candidateData.graduationDate,
                        resumeUrl: candidateData.resumeUrl,
                    },
                },
            },
        },
    });

    return entry;
}

/**
 * Batch add candidates to a position (CSV upload flow)
 * Creates candidates if they don't exist, then adds them to position
 *
 */
async function batchAddCandidatesToPosition(
    candidates: AddCandidateWithDataDTO[],
    positionId: string,
    orgId: string
): Promise<BatchAddResult> {
    await validatePositionAccess(positionId, orgId);

    //  batch create candidates before we create the candidate-pool links
    const candidatesCreated = await prisma.candidate.createMany({
        data: candidates.map((c) => ({
            name: c.name,
            email: c.email,
            orgId,
            linkedinUrl: c.linkedinUrl,
            githubUrl: c.githubUrl,
            major: c.major,
            graduationDate: c.graduationDate,
            resumeUrl: c.resumeUrl,
        })),
        skipDuplicates: true, // skip already existing candidates
    });

    const emails = candidates.map((c) => c.email);
    const candidateRecords = await prisma.candidate.findMany({
        where: {
            email: { in: emails },
            orgId,
        },
        select: { id: true },
    });

    const entriesCreated = await prisma.candidatePoolEntry.createMany({
        data: candidateRecords.map((c) => ({
            candidateId: c.id,
            positionId,
        })),
        skipDuplicates: true,
    });

    // not sure what would be useful to return here - can come back to this
    return {
        candidatesCreated: candidatesCreated.count,
        entriesCreated: entriesCreated.count,
        totalProcessed: candidates.length,
    };
}

/**
 * Get all candidates in a position's pool
 * Includes candidate details and assessment/decision status
 */
async function getPositionCandidates(
    positionId: string,
    orgId: string
): Promise<CandidatePoolDisplayInfo[]> {
    await validatePositionAccess(positionId, orgId);

    const entries = await prisma.candidatePoolEntry.findMany({
        where: { positionId },
        select: {
            assessmentStatus: true,
            decisionStatus: true,

            candidate: {
                select: {
                    name: true,
                    major: true,
                    graduationDate: true,
                    githubUrl: true,
                    resumeUrl: true,
                },
            },

            assessment: {
                select: {
                    id: true,
                    uniqueLink: true,
                    submittedAt: true,
                },
            },

            decisionMaker: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { assessmentStatus: 'desc' },
    });

    return entries;
}

/**
 * Remove a single candidate from a position
 * This will cascade delete their assessment if one exists
 */
async function removeCandidateFromPosition(
    candidateId: string,
    positionId: string,
    orgId: string
): Promise<void> {
    await validatePositionAccess(positionId, orgId);

    await prisma.candidatePoolEntry.delete({
        where: {
            candidateId_positionId: {
                candidateId,
                positionId,
            },
        },
    });
}

/**
 * Remove all candidates from a position
 * This will cascade delete all assessments
 */
async function removeAllCandidatesFromPosition(positionId: string, orgId: string): Promise<void> {
    await validatePositionAccess(positionId, orgId);
    await prisma.candidatePoolEntry.deleteMany({ where: { positionId } });
}

async function getCandidatePoolEntry(id: string): Promise<CandidatePoolEntry | null> {
    return prisma.candidatePoolEntry.findUnique({ where: { id } });
}

async function getAssessmentStatus(candidatePoolEntryId: string): Promise<AssessmentStatus> {
    const entry = await prisma.candidatePoolEntry.findUnique({
        where: { id: candidatePoolEntryId },
        select: { assessmentStatus: true },
    });
    if (!entry) {
        throw new NotFoundException('Candidate Pool Entry', candidatePoolEntryId);
    }
    return entry.assessmentStatus;
}

async function updateAssessmentStatus(params: {
    id: string;
    assessmentStatus: AssessmentStatus;
}): Promise<CandidatePoolEntry> {
    const { id, assessmentStatus } = params;
    const entry = await prisma.candidatePoolEntry.update({
        where: { id },
        data: { assessmentStatus },
    });
    return entry;
}

const CandidatePoolService = {
    addCandidateToPosition,
    batchAddCandidatesToPosition,
    getPositionCandidates,
    removeCandidateFromPosition,
    removeAllCandidatesFromPosition,
    getCandidatePoolEntry,
    getAssessmentStatus,
    updateAssessmentStatus,
};

export default CandidatePoolService;
