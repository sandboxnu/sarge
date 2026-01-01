import { prisma } from '@/lib/prisma';
import type {
    UpdateAssessmentDTO,
    CreateAssessmentDTO,
    Assessment,
} from '@/lib/schemas/assessment.schema';
import { NotFoundException } from '@/lib/utils/errors.utils';
import type { ApplicationDTO } from '@/lib/schemas/application.schema';
import type { AssessmentTemplate } from '@/lib/schemas/assessment-template.schema';

export type AssessmentWithRelations = Assessment & {
    application: ApplicationDTO;
    assessmentTemplate: AssessmentTemplate;
};

async function getAssessmentWithRelations(id: string): Promise<AssessmentWithRelations> {
    const foundAssessment = await prisma.assessment.findFirst({
        where: {
            id,
        },
        include: {
            application: true,
            assessmentTemplate: true,
        },
    });

    if (!foundAssessment) {
        throw new NotFoundException(`Assessment with id ${id} not found`);
    }

    return foundAssessment;
}

async function createAssessment(assessment: CreateAssessmentDTO): Promise<Assessment> {
    const application = await prisma.application.findFirst({
        where: {
            id: assessment.applicationId,
        },
    });

    const assessmentTemplate = await prisma.assessmentTemplate.findFirst({
        where: {
            id: assessment.assessmentTemplateId,
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

async function deleteAssessment(id: string): Promise<Assessment> {
    const existingAssessment = await prisma.assessment.findUnique({
        where: { id },
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

async function updateAssessment(assessment: UpdateAssessmentDTO): Promise<Assessment> {
    const existingAssessment = await prisma.assessment.findUnique({
        where: { id: assessment.id },
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
