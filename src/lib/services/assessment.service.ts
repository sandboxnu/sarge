import { prisma } from '@/lib/prisma';
import type {
    UpdateAssessmentDTO,
    CreateAssessmentDTO,
    Assessment,
} from '@/lib/schemas/assessment.schema';
import { NotFoundException } from '@/lib/utils/errors.utils';
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
    deleteAssessment,
    updateAssessment,
};

export default AssessmentService;
