import { prisma } from '@/lib/prisma';
import { type CreatePositionDTO, type UpdatePositionDTO } from '@/lib/schemas/position.schema';
import { type Position } from '@/generated/prisma';
import { AssessmentStatus } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import {
    type PositionWithCounts,
    type PositionPreviewData,
} from '@/lib/types/position.types';

async function createPosition(
    positionRequest: CreatePositionDTO,
    userId: string,
    orgId: string
): Promise<Position> {
    const position = await prisma.position.create({
        data: {
            title: positionRequest.title,
            createdById: userId,
            orgId,
        },
    });

    return position;
}

async function deletePosition(positionId: string): Promise<Position> {
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    const deleted = await prisma.position.delete({ where: { id: positionId } });
    return deleted;
}

async function getPosition(positionId: string): Promise<Position> {
    const position = await prisma.position.findUnique({
        where: {
            id: positionId,
        },
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
            _count: {
                select: {
                    poolCandidates: true,
                },
            },
            createdAt: true,
            poolCandidates: {
                where: { assessmentStatus: AssessmentStatus.ASSIGNED },
                select: { id: true },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        numCandidates: p._count.poolCandidates,
        numAssigned: p.poolCandidates.length,
        createdAt: p.createdAt,
    }));
}

async function updatePosition(
    positionId: string,
    positionData: UpdatePositionDTO
): Promise<Position> {
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    const updatedPosition = await prisma.position.update({
        where: { id: positionId },
        data: positionData,
    });
    return updatedPosition;
}

async function getPositionPreview(positionId: string): Promise<PositionPreviewData> {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        select: {
            id: true,
            title: true,
            createdAt: true,
            poolCandidates: {
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
        position.poolCandidates.find((entry) => entry.assessment?.assessmentTemplate)?.assessment
            ?.assessmentTemplate ?? null;

    const stats = position.poolCandidates.reduce(
        (acc, entry) => {
            if (entry.assessmentStatus !== AssessmentStatus.NOT_ASSIGNED) {
                acc.totalSent++;
            }
            if (
                entry.assessmentStatus === AssessmentStatus.SUBMITTED ||
                entry.assessmentStatus === AssessmentStatus.GRADED
            ) {
                acc.totalSubmitted++;
            }
            if (entry.assessmentStatus === AssessmentStatus.GRADED) {
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
        candidateCount: position.poolCandidates.length,
        assessmentTemplate,
        candidates: position.poolCandidates.map((entry) => ({
            id: entry.id,
            assessmentStatus: entry.assessmentStatus,
            decisionStatus: entry.decisionStatus,
            candidate: entry.candidate,
            assessment: entry.assessment
                ? {
                      id: entry.assessment.id,
                      uniqueLink: entry.assessment.uniqueLink,
                      submittedAt: entry.assessment.submittedAt,
                      reviews: entry.assessment.reviews.map((review) => ({
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
