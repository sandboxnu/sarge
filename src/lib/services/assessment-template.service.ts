import {
    type AssessmentTemplateListItemDTO,
    type CreateAssessmentTemplateDTO,
    type UpdateAssessmentTemplateDTO,
} from '@/lib/schemas/assessment-template.schema';
import { type AssessmentTemplate } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import { prisma } from '@/lib/prisma';

async function getAssessmentTemplate(id: string, orgId: string): Promise<AssessmentTemplate> {
    const foundAssessmentTemplate = await prisma.assessmentTemplate.findFirst({
        where: {
            id,
            orgId,
        },
    });

    if (!foundAssessmentTemplate) {
        throw new NotFoundException('Assessment Template', id);
    }

    return foundAssessmentTemplate;
}

async function createAssessmentTemplate(
    assessment: CreateAssessmentTemplateDTO & { orgId: string }
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

async function deleteAssessmentTemplate(id: string, orgId: string): Promise<AssessmentTemplate> {
    const existingTemplate = await prisma.assessmentTemplate.findFirst({
        where: { id, orgId },
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
    assessmentTemplate: UpdateAssessmentTemplateDTO & { orgId: string }
): Promise<AssessmentTemplate> {
    const { id, orgId, ...updateData } = assessmentTemplate;
    const existingTemplate = await prisma.assessmentTemplate.findFirst({
        where: { id, orgId },
    });

    if (!existingTemplate) {
        throw new NotFoundException('Assessment Template', id);
    }

    return prisma.assessmentTemplate.update({
        where: { id },
        data: {
            ...updateData,
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
        include: {
            author: { select: { id: true, name: true } },
            positions: { select: { id: true, title: true } },
        },
    });

    const data = assessmentTemplatesWithTitle.map(({ author, ...rest }) => ({
        ...rest,
        author,
    }));

    return data;
}

async function getAssessmentTemplates(
    orgId: string,
    page?: number,
    limit?: number
): Promise<{ data: AssessmentTemplateListItemDTO[]; total: number }> {
    page = page ?? 0;
    limit = limit ?? Number.MAX_SAFE_INTEGER;

    const [templates, total] = await prisma.$transaction([
        prisma.assessmentTemplate.findMany({
            where: { orgId },
            include: {
                author: { select: { id: true, name: true } },
                positions: { select: { id: true, title: true } },
            },
            skip: page * limit,
            take: limit,
        }),
        prisma.assessmentTemplate.count({
            where: { orgId },
        }),
    ]);

    const data = templates.map(({ author, ...rest }) => ({
        ...rest,
        author,
    }));

    return { data, total };
}

const AssessmentTemplateService = {
    getAssessmentTemplate,
    createAssessmentTemplate,
    deleteAssessmentTemplate,
    updateAssessmentTemplate,
    getAssessmentTemplatesByTitle,
    getAssessmentTemplates,
};

export default AssessmentTemplateService;
