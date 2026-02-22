import {
    AssessmentTemplateDetailSchema,
    type AssessmentTemplateDetailDTO,
    type AssessmentTemplateListItemDTO,
    type CreateAssessmentTemplateDTO,
    type UpdateAssessmentTemplateDTO,
} from '@/lib/schemas/assessment-template.schema';
import type { AssessmentTemplate } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import { prisma } from '@/lib/prisma';

async function getAssessmentTemplate(
    id: string,
    orgId: string
): Promise<AssessmentTemplateDetailDTO> {
    const foundAssessmentTemplate = await prisma.assessmentTemplate.findFirst({
        where: { id, orgId },
        include: {
            author: { select: { id: true, name: true } },
            positions: { select: { id: true, title: true } },
            tasks: {
                include: {
                    taskTemplate: {
                        include: {
                            tags: true,
                            languages: true,
                        },
                    },
                },
                orderBy: { order: 'asc' },
            },
        },
    });

    if (!foundAssessmentTemplate) {
        throw new NotFoundException('Assessment Template', id);
    }

    return AssessmentTemplateDetailSchema.parse(foundAssessmentTemplate);
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

    return prisma.assessmentTemplate.update({ where: { id }, data: updateData });
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
    })) as AssessmentTemplateListItemDTO[];

    return { data, total };
}

async function updateAssessmentTemplateTasks(
    assessmentTemplateId: string,
    orgId: string,
    tasks: { taskTemplateId: string }[]
): Promise<void> {
    const template = await prisma.assessmentTemplate.findFirst({
        where: { id: assessmentTemplateId, orgId },
        select: { id: true },
    });

    if (!template) {
        throw new NotFoundException('Assessment Template', assessmentTemplateId);
    }

    await prisma.$transaction([
        prisma.assessmentTemplateTask.deleteMany({
            where: { assessmentTemplateId },
        }),
        ...tasks.map((task, index) =>
            prisma.assessmentTemplateTask.create({
                data: {
                    assessmentTemplateId,
                    taskTemplateId: task.taskTemplateId,
                    order: index,
                },
            })
        ),
    ]);
}

async function getAssessmentTemplateTaskOrder(
    assessmentTemplateId: string
): Promise<Array<{ taskTemplateId: string; order: number }>> {
    return prisma.assessmentTemplateTask.findMany({
        where: { assessmentTemplateId },
        select: {
            taskTemplateId: true,
            order: true,
        },
        orderBy: { order: 'asc' },
    });
}

const AssessmentTemplateService = {
    getAssessmentTemplate,
    createAssessmentTemplate,
    deleteAssessmentTemplate,
    updateAssessmentTemplate,
    updateAssessmentTemplateTasks,
    getAssessmentTemplatesByTitle,
    getAssessmentTemplates,
    getAssessmentTemplateTaskOrder,
};

export default AssessmentTemplateService;
