import { prisma } from '@/lib/prisma';
import { type CreatePositionDTO, type UpdatePositionDTO } from '@/lib/schemas/position.schema';
import { type Position, AssessmentStatus } from '@/generated/prisma';
import { NotFoundException, ConflictException } from '@/lib/utils/errors.utils';
import { type PositionWithCounts, type PositionPreviewData } from '@/lib/types/position.types';

async function createPosition(
    positionRequest: CreatePositionDTO,
    userId: string,
    orgId: string
): Promise<Position> {
    const positionNameExists = await prisma.position.findFirst({
        where: {
            title: positionRequest.title,
            orgId,
        },
    });

    if (positionNameExists) {
        throw new ConflictException('Name', positionRequest.title);
    }

    return prisma.position.create({
        data: {
            title: positionRequest.title,
            createdById: userId,
            orgId,
        },
    });
}

async function deletePosition(positionId: string, orgId: string): Promise<Position> {
    const existingPosition = await prisma.position.findFirst({
        where: { id: positionId, orgId },
    });

    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    return prisma.position.delete({ where: { id: positionId } });
}

async function getPosition(positionId: string, orgId: string): Promise<Position> {
    const position = await prisma.position.findFirst({
        where: { id: positionId, orgId },
    });

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    return position;
}

async function getPositionsByOrgId(orgId: string): Promise<PositionWithCounts[]> {
    const positions = await prisma.position.findMany({
        where: { orgId },
        select: {
            id: true,
            title: true,
            createdAt: true,
            archived: true,
            _count: {
                select: {
                    applications: true,
                },
            },
            applications: {
                select: { id: true },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        archived: p.archived,
        numCandidates: p._count.applications,
        numAssigned: p.applications.length,
        createdAt: p.createdAt,
    }));
}

async function updatePosition(
    positionId: string,
    positionData: UpdatePositionDTO,
    orgId: string
): Promise<Position> {
    const existingPosition = await prisma.position.findFirst({
        where: { id: positionId, orgId },
    });

    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    return prisma.position.update({
        where: { id: positionId },
        data: positionData,
    });
}

async function getPositionPreview(
    positionId: string,
    orgId: string
): Promise<PositionPreviewData> {
    const position = await prisma.position.findFirst({
        where: { id: positionId, orgId },
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

async function getPositionsByTitle(title: string, orgId: string): Promise<PositionWithCounts[]> {
    const positions = await prisma.position.findMany({
        where: {
            orgId,
            title: {
                contains: title,
                mode: 'insensitive',
            },
        },
        select: {
            id: true,
            title: true,
            createdAt: true,
            archived: true,
            _count: {
                select: {
                    applications: true,
                },
            },
            applications: {
                select: { id: true },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        archived: p.archived,
        numCandidates: p._count.applications,
        numAssigned: p.applications.length,
        createdAt: p.createdAt,
    }));
}

const PositionService = {
    createPosition,
    deletePosition,
    getPosition,
    getPositionsByOrgId,
    getPositionPreview,
    updatePosition,
    getPositionsByTitle,
};

export default PositionService;
