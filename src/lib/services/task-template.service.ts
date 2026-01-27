import type { TaskTemplate, Tag } from '@/generated/prisma';
import {
    type UpdateTaskTemplateDTO,
    type CreateTaskTemplateDTO,
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

async function getAllTaskTemplates(): Promise<Array<TaskTemplate & { tags: Tag[] }>> {
    const templates = await prisma.taskTemplate.findMany({
        include: {
            tags: true,
        },
    });
    return templates;
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

async function updateTaskTemplate(taskTemplate: UpdateTaskTemplateDTO): Promise<TaskTemplate> {
    const { id, title, content, publicTestCases, privateTestCases, tags } = taskTemplate;

    const current = await prisma.taskTemplate.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Task Template', id);

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

    const updatedTaskTemplate = await prisma.taskTemplate.update({
        where: {
            id,
        },
        data: {
            title,
            content,
            publicTestCases,
            privateTestCases,
            tags: tags
                ? {
                      set: tags.map((tag) => ({ id: tag })),
                  }
                : undefined,
        },
    });
    return updatedTaskTemplate;
}

async function getTaskTemplatesByTitle(title: string, orgId: string): Promise<TaskTemplate[]> {
    const taskTemplatesWithTitle = await prisma.taskTemplate.findMany({
        where: {
            orgId,
            title: {
                contains: title,
                mode: 'insensitive',
            },
        },
    });

    return taskTemplatesWithTitle;
}

async function getAllTaskTemplates(orgId: string): Promise<TaskTemplate[]> {
    const taskTemplates = await prisma.taskTemplate.findMany({
        where: {
            orgId,
        },
    });

    return taskTemplates;
}

const TaskTemplateService = {
    getTaskTemplate,
    getAllTaskTemplates,
    createTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
    getTaskTemplatesByTitle,
    getAllTaskTemplates,
};

export default TaskTemplateService;
