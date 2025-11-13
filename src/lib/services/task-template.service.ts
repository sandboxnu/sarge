import { type TaskTemplate } from '@/generated/prisma';
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
            tags: taskTemplate.tagIds?.length
                ? { connect: taskTemplate.tagIds.map((id) => ({ id })) }
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
    const { id, title, content, public_test_cases, private_test_cases, tagIds } = taskTemplate;

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
            public_test_cases,
            private_test_cases,
            tags: tagIds?.length ? { set: tagIds.map((tagId) => ({ id: tagId })) } : undefined,
        },
    });
    return updatedTaskTemplate;
}

const TaskTemplateService = {
    getTaskTemplate,
    createTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
};

export default TaskTemplateService;
