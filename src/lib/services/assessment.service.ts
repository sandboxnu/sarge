import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import type {
    UpdateAssessmentDTO,
    CreateAssessmentDTO,
    Assessment,
} from '@/lib/schemas/assessment.schema';
import { AssessmentStatus, type Prisma } from '@/generated/prisma';
import { BadRequestException, NotFoundException } from '@/lib/utils/errors.utils';
import { type AssessmentWithRelations } from '@/lib/types/assessment.types';

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

    const newAssessment = await prisma.assessment.create({
        data: assessment,
    });

    return newAssessment;
}

function buildAssessmentLinkToken() {
    return crypto.randomUUID();
}

async function createAssessmentForApplicationTx(
    tx: Prisma.TransactionClient,
    params: {
        applicationId: string;
        assessmentTemplateId: string;
    }
) {
    const assessment = await tx.assessment.create({
        data: {
            applicationId: params.applicationId,
            assessmentTemplateId: params.assessmentTemplateId,
            uniqueLink: buildAssessmentLinkToken(),
        },
    });

    await tx.application.update({
        where: { id: params.applicationId },
        data: { assessmentStatus: AssessmentStatus.NOT_STARTED },
    });

    return assessment;
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
            await createAssessmentForApplicationTx(tx, {
                applicationId: application.id,
                assessmentTemplateId,
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

const AssessmentService = {
    getAssessmentWithRelations,
    createAssessment,
    createAssessmentForApplicationTx,
    assignTemplateToPosition,
    deleteAssessment,
    updateAssessment,
};

export default AssessmentService;
