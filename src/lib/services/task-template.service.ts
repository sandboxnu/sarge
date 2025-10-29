import { type TaskTemplate } from '@/generated/prisma';
import {
    type UpdateTaskTemplateDTO,
    type CreateTaskTemplateDTO,
} from '@/lib/schemas/taskTemplate.schema';
import { prisma } from '@/lib/prisma';
import { type Result, notFound, conflict, success } from '@/lib/responses';

async function getTaskTemplate(id: string): Promise<Result<TaskTemplate>> {
    const foundTaskTemplate = await prisma.taskTemplate.findFirst({
        where: {
            id,
        },
    });

    if (!foundTaskTemplate) {
        return notFound('Task Template', id);
    }

    return success(foundTaskTemplate, 200);
}

async function createTaskTemplate(
    taskTemplate: CreateTaskTemplateDTO
): Promise<Result<TaskTemplate>> {
    const org = await prisma.organization.findFirst({
        where: {
            id: taskTemplate.orgId,
        },
    });

    if (!org) {
        return notFound('Organization', taskTemplate.orgId);
    }

    const created = await prisma.taskTemplate.create({
        data: taskTemplate,
    });
    return success(created, 201);
}

async function deleteTaskTemplate(id: string): Promise<Result<TaskTemplate>> {
    const existingTemplate = await prisma.taskTemplate.findUnique({
        where: { id },
    });

    if (!existingTemplate) {
        return notFound('Task Template', id);
    }

    const deleted = await prisma.taskTemplate.delete({
        where: {
            id,
        },
    });
    return success(deleted, 200);
}

async function updateTaskTemplate(
    taskTemplate: UpdateTaskTemplateDTO
): Promise<Result<TaskTemplate>> {
    const { id, title, content, public_test_cases, private_test_cases } = taskTemplate;

    const current = await prisma.taskTemplate.findUnique({ where: { id } });
    if (!current) return notFound('Task Template', id);

    const hasDuplicateName = await prisma.taskTemplate.findFirst({
        where: {
            orgId: current.orgId,
            title,
            id: { not: id },
        },
        select: { id: true },
    });

    if (hasDuplicateName) {
        return conflict('Task Template', 'with that name');
    }

    const updated = await prisma.taskTemplate.update({
        where: {
            id,
        },
        data: {
            title,
            content,
            public_test_cases,
            private_test_cases,
        },
    });
    return success(updated, 200);
}

const TaskTemplateService = {
    getTaskTemplate,
    createTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
};

export default TaskTemplateService;
