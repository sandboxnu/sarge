import { type TaskTemplate } from '@/generated/prisma';
import {
    type CreateTaskTemplateDTO,
    type UpdateTaskTemplateDTO,
} from '@/lib/schemas/task-template.schema';
import { prisma } from '@/lib/prisma';
import { NotFoundException, ConflictException } from '@/lib/utils/errors.utils';

async function getTaskTemplate(id: string): Promise<TaskTemplate> {
    const foundTaskTemplate = await prisma.taskTemplate.findFirst({
        where: {
            id,
        },
        include: {
            tags: true,
        },
    });

    if (!foundTaskTemplate) {
        throw new NotFoundException('Task Template', id);
    }

    return foundTaskTemplate;
}

async function getAllTaskTemplatesByOrgId(orgId: string) {
    const templates = await prisma.taskTemplate.findMany({
        where: { orgId },
        select: {
            id: true,
            title: true,
            tags: {
                select: { id: true, name: true, colorHexCode: true },
            },
        },
        orderBy: { title: 'asc' },
    });

    return templates;
}

async function getTaskTemplateDetail(id: string, orgId: string) {
    const template = await prisma.taskTemplate.findUnique({
        where: { id },
        include: {
            tags: {
                select: { id: true, name: true, colorHexCode: true },
            },
            starterCodes: {
                select: { id: true, language: true, code: true },
                orderBy: { language: 'asc' },
            },
        },
    });

    if (!template) {
        throw new NotFoundException('Task Template', id);
    }

    // Authorization check - ensure template belongs to org
    if (template.orgId !== orgId) {
        throw new NotFoundException('Task Template', id);
    }

    return template;
}

async function createTaskTemplate(taskTemplate: CreateTaskTemplateDTO): Promise<TaskTemplate> {
    const org = await prisma.organization.findFirst({
        where: {
            id: taskTemplate.orgId,
        },
    });

    if (!org) {
        throw new NotFoundException('Organization', taskTemplate.orgId);
    }

    const createdTaskTemplate = await prisma.taskTemplate.create({
        data: {
            ...taskTemplate,
            tags: taskTemplate.tags?.length
                ? { connect: taskTemplate.tags.map((id) => ({ id })) }
                : undefined,
        },
    });
    return createdTaskTemplate;
}

async function deleteTaskTemplate(id: string): Promise<TaskTemplate> {
    const existingTemplate = await prisma.taskTemplate.findUnique({
        where: { id },
    });

    if (!existingTemplate) {
        throw new NotFoundException('Task Template', id);
    }

    const deletedTaskTemplate = await prisma.taskTemplate.delete({
        where: {
            id,
        },
    });
    return deletedTaskTemplate;
}

async function updateTaskTemplate(input: UpdateTaskTemplateDTO): Promise<TaskTemplate> {
    const { id, title, description, publicTestCases, privateTestCases, tags, starterCodes } = input;

    const current = await prisma.taskTemplate.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Task Template', id);

    // Check for duplicate names (only if title is being changed)
    if (title && title !== current.title) {
        const hasDuplicateName = await prisma.taskTemplate.findFirst({
            where: {
                orgId: current.orgId,
                title,
                id: { not: id },
            },
            select: { id: true },
        });

        if (hasDuplicateName) {
            throw new ConflictException('Task Template', 'with that name');
        }
    }

    const updatedTaskTemplate = await prisma.taskTemplate.update({
        where: {
            id,
        },
        data: {
            title,
            description: description ?? undefined,
            publicTestCases,
            privateTestCases,
            tags: tags
                ? {
                      set: tags.map((tagId) => ({ id: tagId })),
                  }
                : undefined,
            starterCodes: starterCodes
                ? {
                      deleteMany: {},
                      create: starterCodes.map((sc) => ({
                          language: sc.language,
                          code: sc.code,
                      })),
                  }
                : undefined,
        },
        include: {
            tags: true,
            starterCodes: true,
        },
    });
    return updatedTaskTemplate;
}

const TaskTemplateService = {
    getTaskTemplate,
    createTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
    getAllTaskTemplatesByOrgId,
    getTaskTemplateDetail,
};

export default TaskTemplateService;
