import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import type {
    UpdateAssessmentDTO,
    CreateAssessmentDTO,
    Assessment,
} from '@/lib/schemas/assessment.schema';
import { AssessmentStatus } from '@/generated/prisma';
import { BadRequestException, NotFoundException } from '@/lib/utils/errors.utils';
import {
    type AssessmentWithRelations,
    type AssessmentInvitationResult,
} from '@/lib/types/assessment-template.types';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import emailService from '@/lib/services/email.service';

async function getAssessmentWithRelations(
    id: string,
    orgId: string
): Promise<AssessmentWithRelations> {
    const foundAssessment = await prisma.assessment.findFirst({
        where: {
            id,
            application: {
                position: {
                    orgId,
                },
            },
        },
        include: {
            application: true,
            assessmentTemplate: {
                include: {
                    tasks: true,
                },
            },
        },
    });

    if (!foundAssessment) {
        throw new NotFoundException(`Assessment with id ${id} not found`);
    }

    return foundAssessment;
}

async function createAssessment(
    assessment: CreateAssessmentDTO,
    orgId: string
): Promise<Assessment> {
    const application = await prisma.application.findFirst({
        where: {
            id: assessment.applicationId,
            position: {
                orgId,
            },
        },
    });

    const assessmentTemplate = await prisma.assessmentTemplate.findFirst({
        where: {
            id: assessment.assessmentTemplateId,
            orgId,
        },
    });

    if (!application) {
        throw new NotFoundException(`Application with id ${assessment.applicationId} not found`);
    }

    if (!assessmentTemplate) {
        throw new NotFoundException(
            `Assessment Template with id ${assessment.assessmentTemplateId} not found`
        );
    }
    // the unique link shouldn't be the full link (bc the env of the link matters) so we just use id
    const id = crypto.randomUUID();
    const newAssessment = await prisma.assessment.create({
        data: { ...assessment, id, uniqueLink: id },
    });

    return newAssessment;
}

function buildAssessmentLinkToken() {
    return crypto.randomUUID();
}

async function assignTemplateToPosition(params: {
    positionId: string;
    assessmentTemplateId: string;
    orgId: string;
}) {
    const { positionId, assessmentTemplateId, orgId } = params;

    const [position, template] = await Promise.all([
        prisma.position.findFirst({
            where: { id: positionId, orgId },
            select: {
                id: true,
                title: true,
                assessmentId: true,
                applications: {
                    select: {
                        id: true,
                        assessment: {
                            select: {
                                id: true,
                                assessmentTemplateId: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.assessmentTemplate.findFirst({
            where: { id: assessmentTemplateId, orgId },
            select: { id: true, title: true },
        }),
    ]);

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    if (!template) {
        throw new NotFoundException('Assessment Template', assessmentTemplateId);
    }

    const isAlreadyAssignedToTemplate = position.assessmentId === assessmentTemplateId;

    if (position.assessmentId && position.assessmentId !== assessmentTemplateId) {
        throw new BadRequestException(
            'This position is already assigned to a different assessment template.'
        );
    }

    const applicationsMissingAssessment = position.applications.filter(
        (application) => !application.assessment
    );
    const assessmentsWithDifferentTemplate = position.applications.filter(
        (application) =>
            application.assessment &&
            application.assessment.assessmentTemplateId !== assessmentTemplateId
    );

    if (assessmentsWithDifferentTemplate.length > 0) {
        throw new BadRequestException(
            'This position already has assessments. Reassignment is not supported.'
        );
    }

    await prisma.$transaction(async (tx) => {
        if (!isAlreadyAssignedToTemplate) {
            await tx.position.update({
                where: { id: positionId },
                data: { assessmentId: assessmentTemplateId },
            });
        }

        for (const application of applicationsMissingAssessment) {
            await tx.assessment.create({
                data: {
                    applicationId: application.id,
                    assessmentTemplateId,
                    uniqueLink: buildAssessmentLinkToken(),
                },
            });

            await tx.application.update({
                where: { id: application.id },
                data: { assessmentStatus: AssessmentStatus.NOT_SENT },
            });
        }
    });

    return {
        positionId: position.id,
        assessmentTemplateId: template.id,
        assessmentsCreated: applicationsMissingAssessment.length,
    };
}

async function deleteAssessment(id: string, orgId: string): Promise<Assessment> {
    const existingAssessment = await prisma.assessment.findFirst({
        where: {
            id,
            application: {
                position: {
                    orgId,
                },
            },
        },
    });

    if (!existingAssessment) {
        throw new NotFoundException(`Assessment with id ${id} not found`);
    }

    const deletedAssessment = await prisma.assessment.delete({
        where: {
            id,
        },
    });

    return deletedAssessment;
}

async function updateAssessment(
    assessment: UpdateAssessmentDTO,
    orgId: string
): Promise<Assessment> {
    const existingAssessment = await prisma.assessment.findFirst({
        where: {
            id: assessment.id,
            application: {
                position: {
                    orgId,
                },
            },
        },
    });

    if (!existingAssessment) {
        throw new NotFoundException(`Assessment with id ${assessment.id} not found`);
    }

    return await prisma.assessment.update({
        where: {
            id: assessment.id,
        },
        data: assessment,
    });
}

async function getAssessmentForCandidate(assessmentId: string): Promise<CandidateAssessment> {
    const assessment = await prisma.assessment.findFirst({
        where: {
            id: assessmentId,
        },
        select: {
            id: true,
            deadline: true,
            assignedAt: true,
            submittedAt: true,
            application: {
                select: {
                    assessmentStatus: true,
                    candidate: {
                        select: { name: true, email: true },
                    },
                },
            },
            assessmentTemplate: {
                select: {
                    title: true,
                    tasks: {
                        select: {
                            taskTemplateId: true,
                            order: true,
                            taskTemplate: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    publicTestCases: true,
                                    estimatedTime: true,
                                    timeout: true,
                                    languages: {
                                        select: {
                                            id: true,
                                            language: true,
                                            stub: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: { order: 'asc' },
                    },
                },
            },
        },
    });

    if (!assessment) {
        throw new NotFoundException(`Assessment with id ${assessmentId} not found`);
    }

    return {
        id: assessment.id,
        deadline: assessment.deadline,
        assignedAt: assessment.assignedAt,
        submittedAt: assessment.submittedAt,
        assessmentStatus: assessment.application.assessmentStatus,
        candidateName: assessment.application.candidate.name,
        candidateEmail: assessment.application.candidate.email,
        assessmentTemplate: {
            title: assessment.assessmentTemplate.title,
            tasks: assessment.assessmentTemplate.tasks.map((task) => ({
                taskTemplateId: task.taskTemplateId,
                order: task.order,
                taskTemplate: {
                    id: task.taskTemplate.id,
                    title: task.taskTemplate.title,
                    description: task.taskTemplate.description as BlockNoteContent,
                    publicTestCases: task.taskTemplate.publicTestCases as TestCaseDTO[],
                    estimatedTime: task.taskTemplate.estimatedTime,
                    timeout: task.taskTemplate.timeout,
                    languages: task.taskTemplate.languages,
                },
            })),
        },
    };
}

async function submitAssessmentForCandidate(assessmentId: string): Promise<void> {
    const assessment = await prisma.assessment.findFirst({
        where: { id: assessmentId },
        select: { id: true, submittedAt: true, application: { select: { id: true } } },
    });

    if (!assessment) {
        throw new NotFoundException(`Assessment with id ${assessmentId} not found`);
    }

    if (assessment.submittedAt) {
        throw new BadRequestException('Assessment has already been submitted');
    }

    await prisma.$transaction([
        prisma.assessment.update({
            where: { id: assessmentId },
            data: { submittedAt: new Date() },
        }),
        prisma.application.update({
            where: { id: assessment.application.id },
            data: { assessmentStatus: 'SUBMITTED' },
        }),
    ]);
}

async function sendAssessmentInvitationsToPosition(
    positionId: string,
    orgId: string
): Promise<AssessmentInvitationResult> {
    const position = await prisma.position.findUnique({
        where: { id: positionId },
        select: { assessmentId: true, orgId: true },
    });

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    if (position.orgId !== orgId) {
        throw new BadRequestException('Position does not belong to your organization');
    }

    if (!position.assessmentId) {
        throw new BadRequestException('Position does not have an assessment template assigned');
    }

    const applications = await prisma.application.findMany({
        where: {
            positionId,
            assessmentStatus: 'NOT_SENT',
        },
        include: {
            candidate: true,
        },
    });

    const results = [];
    for (const application of applications) {
        try {
            const result = await emailService.sendAssessmentInvitationEmail(
                application.candidate.id,
                orgId
            );

            await prisma.application.update({
                where: { id: application.id },
                data: { assessmentStatus: 'NOT_STARTED' },
            });

            results.push({
                ...result,
                applicationId: application.id,
            });
        } catch (err) {
            results.push({
                success: false,
                message: `Failed to send invitation to ${application.candidate.name}: ${(err as Error).message}`,
                candidateName: application.candidate.name,
                positionTitle: '',
                assessmentId: '',
                applicationId: application.id,
            });
        }
    }

    return {
        totalSent: results.filter((r) => r.success).length,
        totalFailed: results.filter((r) => !r.success).length,
        results,
    };
}

const AssessmentService = {
    getAssessmentWithRelations,
    getAssessmentForCandidate,
    submitAssessmentForCandidate,
    createAssessment,
    assignTemplateToPosition,
    deleteAssessment,
    updateAssessment,
    sendAssessmentInvitationsToPosition,
};

export default AssessmentService;
