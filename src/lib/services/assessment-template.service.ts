import {
    type CreateAssessmentTemplateDTO,
    type UpdateAssessmentTemplateDTO,
} from '@/lib/schemas/assessment-template.schema';
import { type AssessmentTemplate } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import { prisma } from '@/lib/prisma';

async function getAssessmentTemplate(id: string): Promise<AssessmentTemplate> {
    const foundAssessmentTemplate = await prisma.assessmentTemplate.findUnique({
        where: {
            id,
        },
    });

    if (!foundAssessmentTemplate) {
        throw new NotFoundException('Assessment Template', id);
    }

    return foundAssessmentTemplate;
}

async function createAssessmentTemplate(
    assessment: CreateAssessmentTemplateDTO
): Promise<AssessmentTemplate> {
    const org = await prisma.organization.findFirst({
        where: {
            id: assessment.orgId,
        },
    });

    if (!org) {
        throw new NotFoundException('Organization', assessment.orgId);
    }

    return prisma.assessmentTemplate.create({
        data: assessment,
    });
}

async function deleteAssessmentTemplate(id: string): Promise<AssessmentTemplate> {
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
        where: { id },
    });

    if (!existingTemplate) {
        throw new NotFoundException('Assessment Template', id);
    }

    const deletedAssessmentTemplate = await prisma.assessmentTemplate.delete({
        where: {
            id,
        },
    });
    return deletedAssessmentTemplate;
}

async function updateAssessmentTemplate(
    assessmentTemplate: UpdateAssessmentTemplateDTO
): Promise<AssessmentTemplate> {
    const existingTemplate = await prisma.assessmentTemplate.findUnique({
        where: { id: assessmentTemplate.id },
    });

    if (!existingTemplate) {
        throw new NotFoundException('Assessment Template', assessmentTemplate.id);
    }

    return prisma.assessmentTemplate.update({
        where: { id: assessmentTemplate.id },
        data: {
            ...assessmentTemplate,
        },
    });
}

async function getAssessmentTemplatesByTitle(
    title: string,
    orgId: string
): Promise<AssessmentTemplate[]> {
    const assessmentTemplatesWithTitle = await prisma.assessmentTemplate.findMany({
        where: {
            orgId,
            title: {
                contains: title,
                mode: 'insensitive',
            },
        },
    });

    return assessmentTemplatesWithTitle;
}

async function getAllAssessmentTemplates(orgId: string): Promise<AssessmentTemplate[]> {
    const assessmentTemplates = await prisma.assessmentTemplate.findMany({
        where: {
            orgId,
        },
    });

    return assessmentTemplates;
}

const AssessmentTemplateService = {
    getAssessmentTemplate,
    createAssessmentTemplate,
    deleteAssessmentTemplate,
    updateAssessmentTemplate,
    getAssessmentTemplatesByTitle,
    getAllAssessmentTemplates,
};

export default AssessmentTemplateService;
