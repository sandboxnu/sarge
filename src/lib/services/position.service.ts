import { prisma } from '@/lib/prisma';
import { type CreatePositionDTO, type UpdatePositionDTO } from '@/lib/schemas/position.schema';
import { type Position, AssessmentStatus } from '@/generated/prisma';
import { NotFoundException, ConflictException } from '@/lib/utils/errors.utils';
import { type PositionWithCounts, type PositionPreviewData } from '@/lib/types/position.types';
import {
    type AwaitingYourReviewItem,
    type ContinueGradingItem,
    type LiveAssessmentSummary,
} from '@/lib/types/reviewing.types';
import { getLiveAssessmentStatus, getReviewCounts } from '@/lib/utils/reviewing.utils';

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

async function archivePosition(positionId: string, orgId: string): Promise<Position> {
    const existingPosition = await prisma.position.findFirst({
        where: { id: positionId, orgId },
        select: {
            archived: true,
        },
    });

    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    if (existingPosition.archived) {
        throw new ConflictException('Position', 'archived');
    }

    return prisma.position.update({
        where: {
            orgId,
            id: positionId,
        },
        data: {
            archived: true,
        },
    });
}

async function unarchivePosition(positionId: string, orgId: string): Promise<Position> {
    const existingPosition = await prisma.position.findFirst({
        where: { id: positionId, orgId },
        select: {
            archived: true,
        },
    });

    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    if (!existingPosition.archived) {
        throw new ConflictException('Position', 'unarchived');
    }

    return prisma.position.update({
        where: {
            orgId,
            id: positionId,
        },
        data: {
            archived: false,
        },
    });
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
            tags: true,
            createdAt: true,
            archived: true,
            assessmentId: true,
            assessmentTemplate: {
                select: {
                    title: true,
                },
            },
            applications: {
                select: {
                    id: true,
                    assessmentStatus: true,
                },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        archived: p.archived,
        numCandidates: p.applications.length,
        numAssigned: p.applications.length,
        assessmentTemplateId: p.assessmentId,
        assessmentTemplateTitle: p.assessmentTemplate?.title ?? null,
        assessmentSentCount: p.applications.filter(
            (application) => application.assessmentStatus !== AssessmentStatus.NOT_ASSIGNED
        ).length,
        assessmentSubmittedCount: p.applications.filter(
            (application) =>
                application.assessmentStatus === AssessmentStatus.SUBMITTED ||
                application.assessmentStatus === AssessmentStatus.GRADED
        ).length,
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

async function getPositionPreview(positionId: string, orgId: string): Promise<PositionPreviewData> {
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
                            submittedAt: true,
                            assessmentTemplate: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                            reviewers: {
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
                      submittedAt: app.assessment.submittedAt,
                      reviewers: app.assessment.reviewers,
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
            tags: true,
            createdAt: true,
            archived: true,
            assessmentId: true,
            assessmentTemplate: {
                select: {
                    title: true,
                },
            },
            applications: {
                select: {
                    id: true,
                    assessmentStatus: true,
                },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        archived: p.archived,
        numCandidates: p.applications.length,
        numAssigned: p.applications.length,
        assessmentTemplateId: p.assessmentId,
        assessmentTemplateTitle: p.assessmentTemplate?.title ?? null,
        assessmentSentCount: p.applications.filter(
            (application) => application.assessmentStatus !== AssessmentStatus.NOT_ASSIGNED
        ).length,
        assessmentSubmittedCount: p.applications.filter(
            (application) =>
                application.assessmentStatus === AssessmentStatus.SUBMITTED ||
                application.assessmentStatus === AssessmentStatus.GRADED
        ).length,
        createdAt: p.createdAt,
    }));
}

async function getLiveAssessmentsByOrgId(
    orgId: string,
    userId: string
): Promise<LiveAssessmentSummary[]> {
    const positions = await prisma.position.findMany({
        where: { orgId, assessmentId: { not: null } },
        select: {
            id: true,
            title: true,
            archived: true,
            updatedAt: true,
            assessmentTemplate: { select: { id: true, title: true } },
            applications: {
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    assessmentStatus: true,
                    updatedAt: true,
                    assessment: {
                        select: {
                            submittedAt: true,
                            reviewers: { select: { id: true } },
                            tasks: {
                                select: {
                                    reviews: {
                                        select: {
                                            reviewerId: true,
                                            updatedAt: true,
                                            reviewer: { select: { name: true } },
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

    return positions.flatMap((position) => {
        if (!position.assessmentTemplate || position.applications.length === 0) return [];

        const { applications } = position;
        const { reviewedCount, remainingCount, awaitingReviewCount } = getReviewCounts(
            applications.map((application) => application.assessmentStatus)
        );

        let lastActivity = position.updatedAt.getTime();
        const continueGrading: ContinueGradingItem[] = [];
        const awaitingYourReview: AwaitingYourReviewItem[] = [];

        for (const application of applications) {
            lastActivity = Math.max(lastActivity, application.updatedAt.getTime());
            const assessment = application.assessment;
            if (!assessment) continue;

            const reviews = assessment.tasks.flatMap((task) => task.reviews);
            for (const review of reviews) {
                lastActivity = Math.max(lastActivity, review.updatedAt.getTime());
            }

            if (application.assessmentStatus !== AssessmentStatus.SUBMITTED) continue;
            if (assessment.tasks.length === 0) continue;

            const progress = getReviewerProgress(assessment.tasks);
            const mine = progress.get(userId);

            if (mine) {
                if (mine.tasksReviewed < assessment.tasks.length) {
                    continueGrading.push({
                        positionId: position.id,
                        positionTitle: position.title,
                        applicationId: application.id,
                        taskCount: assessment.tasks.length,
                        tasksLeft: assessment.tasks.length - mine.tasksReviewed,
                        lastEditedAt: new Date(mine.lastReviewedAt).toISOString(),
                    });
                }
            } else if (assessment.reviewers.some((reviewer) => reviewer.id === userId)) {
                const finished = [...progress.entries()]
                    .filter(([, p]) => p.tasksReviewed >= assessment.tasks.length)
                    .sort(([, a], [, b]) => b.lastReviewedAt - a.lastReviewedAt);

                awaitingYourReview.push({
                    positionId: position.id,
                    positionTitle: position.title,
                    applicationId: application.id,
                    finishedReviewerNames: finished.map(([, p]) => p.name),
                    lastFinishedAt: finished[0]
                        ? new Date(finished[0][1].lastReviewedAt).toISOString()
                        : null,
                    submittedAt: assessment.submittedAt?.toISOString() ?? null,
                });
            }
        }

        const reviewTarget =
            applications.find((a) => a.assessmentStatus === AssessmentStatus.SUBMITTED) ??
            applications.find((a) => a.assessmentStatus === AssessmentStatus.GRADED) ??
            applications.find((a) => a.assessment !== null) ??
            applications[0];

        return [
            {
                positionId: position.id,
                positionTitle: position.title,
                archived: position.archived,
                assessmentTemplateId: position.assessmentTemplate.id,
                assessmentTemplateTitle: position.assessmentTemplate.title,
                candidateCount: applications.length,
                reviewedCount,
                remainingCount,
                awaitingReviewCount,
                status: getLiveAssessmentStatus(reviewedCount, remainingCount),
                lastActivityAt: new Date(lastActivity).toISOString(),
                reviewTargetApplicationId: reviewTarget.id,
                continueGrading,
                awaitingYourReview,
            },
        ];
    });
}

function getReviewerProgress(
    tasks: { reviews: { reviewerId: string; updatedAt: Date; reviewer: { name: string } }[] }[]
) {
    const progress = new Map<
        string,
        { name: string; tasksReviewed: number; lastReviewedAt: number }
    >();
    for (const task of tasks) {
        for (const review of task.reviews) {
            const entry = progress.get(review.reviewerId) ?? {
                name: review.reviewer.name,
                tasksReviewed: 0,
                lastReviewedAt: 0,
            };
            entry.tasksReviewed++;
            entry.lastReviewedAt = Math.max(entry.lastReviewedAt, review.updatedAt.getTime());
            progress.set(review.reviewerId, entry);
        }
    }
    return progress;
}

const PositionService = {
    createPosition,
    deletePosition,
    archivePosition,
    unarchivePosition,
    getPosition,
    getPositionsByOrgId,
    getPositionPreview,
    updatePosition,
    getPositionsByTitle,
    getLiveAssessmentsByOrgId,
};

export default PositionService;
