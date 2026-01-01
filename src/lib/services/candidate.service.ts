import { prisma } from '@/lib/prisma';
import { NotFoundException, ForbiddenException } from '@/lib/utils/errors.utils';
import type { AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import type { BatchAddResult, ApplicationDisplayInfo } from '@/lib/types/position.types';
import type { Application, AssessmentStatus } from '@/generated/prisma';

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
 * Add a single candidate to a position.
 * Internally this creates an Application (candidate + position).
 */
async function addCandidateToPosition(
    candidateData: AddApplicationWithCandidateDataDTO,
    positionId: string,
    orgId: string
): Promise<ApplicationDisplayInfo> {
    await validatePositionAccess(positionId, orgId);

    const application = await prisma.application.create({
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
        select: {
            assessmentStatus: true,
            decisionStatus: true,
            decidedAt: true,
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
            decidedByUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return application;
}

/**
 * Batch add candidates to a position (CSV upload flow).
 * Each row creates an Application.
 */
async function batchAddCandidatesToPosition(
    candidates: AddApplicationWithCandidateDataDTO[],
    positionId: string,
    orgId: string
): Promise<BatchAddResult> {
    await validatePositionAccess(positionId, orgId);

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
        skipDuplicates: true,
    });

    const emails = candidates.map((c) => c.email);
    const candidateRecords = await prisma.candidate.findMany({
        where: { email: { in: emails }, orgId },
        select: { id: true },
    });

    const applicationsCreated = await prisma.application.createMany({
        data: candidateRecords.map((c) => ({
            candidateId: c.id,
            positionId,
        })),
        skipDuplicates: true,
    });

    const applications = await prisma.application.findMany({
        where: {
            positionId,
            candidateId: { in: candidateRecords.map((c) => c.id) },
        },
        select: {
            assessmentStatus: true,
            decisionStatus: true,
            decidedAt: true,
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
            decidedByUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return {
        candidatesCreated: candidatesCreated.count,
        entriesCreated: applicationsCreated.count,
        totalProcessed: candidates.length,
        candidates: applications,
    };
}

/**
 * Get all candidates (applications) for a position.
 */
async function getPositionCandidates(
    positionId: string,
    orgId: string
): Promise<ApplicationDisplayInfo[]> {
    await validatePositionAccess(positionId, orgId);

    const applications = await prisma.application.findMany({
        where: { positionId },
        select: {
            assessmentStatus: true,
            decisionStatus: true,
            decidedAt: true,
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
            decidedByUser: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { assessmentStatus: 'desc' },
    });

    return applications;
}

/**
 * Remove a single candidate from a position.
 * Deletes the corresponding Application (and cascades assessment).
 */
async function removeCandidateFromPosition(
    candidateId: string,
    positionId: string,
    orgId: string
): Promise<void> {
    await validatePositionAccess(positionId, orgId);

    await prisma.application.delete({
        where: {
            candidateId_positionId: {
                candidateId,
                positionId,
            },
        },
    });
}

/**
 * Remove all candidates from a position.
 */
async function removeAllCandidatesFromPosition(positionId: string, orgId: string): Promise<void> {
    await validatePositionAccess(positionId, orgId);
    await prisma.application.deleteMany({ where: { positionId } });
}

async function getApplication(id: string): Promise<Application> {
    const application = await prisma.application.findUnique({ where: { id } });

    if (!application) {
        throw new NotFoundException('Application', id);
    }

    return application;
}

async function getAssessmentStatus(applicationId: string): Promise<AssessmentStatus> {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { assessmentStatus: true },
    });

    if (!application) {
        throw new NotFoundException('Application', applicationId);
    }

    return application.assessmentStatus;
}

async function updateAssessmentStatus(params: {
    id: string;
    assessmentStatus: AssessmentStatus;
}): Promise<Application> {
    const { id, assessmentStatus } = params;

    return prisma.application.update({
        where: { id },
        data: { assessmentStatus },
    });
}

const CandidateService = {
    addCandidateToPosition,
    batchAddCandidatesToPosition,
    getPositionCandidates,
    removeCandidateFromPosition,
    removeAllCandidatesFromPosition,
    getApplication,
    getAssessmentStatus,
    updateAssessmentStatus,
};

export default CandidateService;
