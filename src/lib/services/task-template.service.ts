import { type TaskTemplate, Prisma } from '@/generated/prisma';
import {
    createTaskTemplateSchema,
    deleteTaskTemplateSchema,
    updateTaskTemplateSchema,
    type UpdateTaskTemplateDTO,
    type CreateTaskTemplateDTO,
    type DeleteTaskTemplateDTO,
    type GetTaskTemplateDTO,
    TaskTemplateExistsError,
    TaskTemplateNotFoundError,
    getTaskTemplateSchema,
} from '../schemas/taskTemplate.schema';
import z from 'zod';
import { InvalidInputError } from '../schemas/errors';
import { prisma } from '../prisma';
import { OrganizationNotFoundError } from '../schemas/organization.schema';

async function getTaskTemplate(taskTemplate: GetTaskTemplateDTO): Promise<TaskTemplate> {
    try {
        const validatedTaskTemplateGetParam = getTaskTemplateSchema.parse(taskTemplate);

        console.warn(validatedTaskTemplateGetParam);

        const foundTaskTemplate = await prisma.taskTemplate.findFirst({
            where: {
                id: validatedTaskTemplateGetParam.id,
            },
        });

        if (!foundTaskTemplate) {
            throw new TaskTemplateNotFoundError();
        }

        return foundTaskTemplate;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new InvalidInputError();
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new TaskTemplateNotFoundError();
        }

        throw error;
    }
}

async function createTaskTemplate(taskTemplate: CreateTaskTemplateDTO): Promise<TaskTemplate> {
    try {
        const validatedTaskTemplateCreateBody = createTaskTemplateSchema.parse(taskTemplate);

        const org = await prisma.organization.findFirst({
            where: {
                id: validatedTaskTemplateCreateBody.orgId,
            },
        });

        if (!org) {
            throw new OrganizationNotFoundError();
        }

        // TODO: validate the caller is an admin of the org
        return await prisma.taskTemplate.create({
            data: validatedTaskTemplateCreateBody,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new InvalidInputError();
        }

        throw error;
    }
}

async function deleteTaskTemplate(taskTemplate: DeleteTaskTemplateDTO): Promise<TaskTemplate> {
    try {
        const validatedTaskTemplateDeleteParam = deleteTaskTemplateSchema.parse(taskTemplate);

        // TODO: validate the caller is an admin of the org
        return await prisma.taskTemplate.delete({
            where: {
                id: validatedTaskTemplateDeleteParam.id,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
            throw new TaskTemplateNotFoundError();
        }

        if (error instanceof z.ZodError) {
            throw new InvalidInputError();
        }

        throw error;
    }
}

async function updateTaskTemplate(taskTemplate: UpdateTaskTemplateDTO): Promise<TaskTemplate> {
    try {
        const validatedTaskTemplateUpdateBody = updateTaskTemplateSchema.parse(taskTemplate);

        const { id, title, content, public_test_cases, private_test_cases } =
            validatedTaskTemplateUpdateBody;

        const current = await prisma.taskTemplate.findUnique({ where: { id } });
        if (!current) throw new TaskTemplateNotFoundError();

        const duplicate = await prisma.taskTemplate.findFirst({
            where: {
                orgId: current.orgId,
                title,
                id: { not: id },
            },
            select: { id: true },
        });

        if (duplicate) {
            throw new TaskTemplateExistsError();
        }

        // TODO: validate the caller is an admin of the org
        return await prisma.taskTemplate.update({
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
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new InvalidInputError();
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new TaskTemplateNotFoundError();
        }

        throw error;
    }
}

const TaskTemplateService = {
    getTaskTemplate,
    createTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
};

export default TaskTemplateService;
