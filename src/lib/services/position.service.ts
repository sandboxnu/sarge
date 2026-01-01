import { prisma } from '@/lib/prisma';
import { type CreatePositionDTO, type UpdatePositionDTO } from '@/lib/schemas/position.schema';
import { type Position, AssessmentStatus } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import { type PositionWithCounts, type PositionPreviewData } from '@/lib/types/position.types';

async function createPosition(
    positionRequest: CreatePositionDTO,
    userId: string,
    orgId: string
): Promise<Position> {
    return prisma.position.create({
        data: {
            title: positionRequest.title,
            createdById: userId,
            orgId,
        },
    });
}

async function deletePosition(positionId: string): Promise<Position> {
    const existingPosition = await prisma.position.findUnique({
        where: { id: positionId },
    });

    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    return prisma.position.delete({ where: { id: positionId } });
}

async function getPosition(positionId: string): Promise<Position> {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
    });

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    return position;
}

async function getPositionByOrgId(orgId: string): Promise<PositionWithCounts[]> {
    const positions = await prisma.position.findMany({
        where: { orgId },
        select: {
            id: true,
            title: true,
            createdAt: true,
            _count: {
                select: {
                    applications: true,
                },
            },
            applications: {
                where: { assessmentStatus: AssessmentStatus.ASSIGNED },
                select: { id: true },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        numCandidates: p._count.applications,
        numAssigned: p.applications.length,
        createdAt: p.createdAt,
    }));
}

async function updatePosition(
    positionId: string,
    positionData: UpdatePositionDTO
): Promise<Position> {
    const existingPosition = await prisma.position.findUnique({
        where: { id: positionId },
    });

    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    return prisma.position.update({
        where: { id: positionId },
        data: positionData,
    });
}

async function getPositionPreview(positionId: string): Promise<PositionPreviewData> {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        select: {
            id: true,
            title: true,
            createdAt: true,
            applications: {
                select: {
                    id: true,
                    assessmentStatus: true,
                    decisionStatus: true,
                    candidate: {
                        select: {
                            id: true,
                            name: true,
                            major: true,
                            graduationDate: true,
                        },
                    },
                    assessment: {
                        select: {
                            id: true,
                            uniqueLink: true,
                            submittedAt: true,
                            assessmentTemplate: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                            reviews: {
                                select: {
                                    reviewer: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                            image: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    const assessmentTemplate =
        position.applications.find((app) => app.assessment?.assessmentTemplate)?.assessment
            ?.assessmentTemplate ?? null;

    const stats = position.applications.reduce(
        (acc, app) => {
            if (app.assessmentStatus !== AssessmentStatus.NOT_ASSIGNED) {
                acc.totalSent++;
            }
            if (
                app.assessmentStatus === AssessmentStatus.SUBMITTED ||
                app.assessmentStatus === AssessmentStatus.GRADED
            ) {
                acc.totalSubmitted++;
            }
            if (app.assessmentStatus === AssessmentStatus.GRADED) {
                acc.totalGraded++;
            }
            return acc;
        },
        { totalSent: 0, totalSubmitted: 0, totalGraded: 0 }
    );

    return {
        id: position.id,
        title: position.title,
        createdAt: position.createdAt,
        candidateCount: position.applications.length,
        assessmentTemplate,
        candidates: position.applications.map((app) => ({
            id: app.id,
            assessmentStatus: app.assessmentStatus,
            decisionStatus: app.decisionStatus,
            candidate: app.candidate,
            assessment: app.assessment
                ? {
                      id: app.assessment.id,
                      uniqueLink: app.assessment.uniqueLink,
                      submittedAt: app.assessment.submittedAt,
                      reviews: app.assessment.reviews.map((review) => ({
                          reviewer: review.reviewer,
                      })),
                  }
                : null,
        })),
        stats,
    };
}

const PositionService = {
    createPosition,
    deletePosition,
    getPosition,
    getPositionByOrgId,
    getPositionPreview,
    updatePosition,
};

export default PositionService;
