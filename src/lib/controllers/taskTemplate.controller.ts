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

class TaskTemplateController {
    async get(taskTemplate: GetTaskTemplateDTO): Promise<TaskTemplate> {
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

    async create(taskTemplate: CreateTaskTemplateDTO): Promise<TaskTemplate> {
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

    async delete(taskTemplate: DeleteTaskTemplateDTO): Promise<TaskTemplate> {
        try {
            const validatedTaskTemplateDeleteParam = deleteTaskTemplateSchema.parse(
                taskTemplate.id
            );

            return await prisma.taskTemplate.delete({
                where: {
                    id: validatedTaskTemplateDeleteParam.id,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
                throw new TaskTemplateExistsError();
            }

            if (error instanceof z.ZodError) {
                throw new InvalidInputError();
            }

            throw error;
        }
    }

    async update(taskTemplate: UpdateTaskTemplateDTO): Promise<TaskTemplate> {
        try {
            const validatedTaskTemplateUpdateBody = updateTaskTemplateSchema.parse(taskTemplate);

            const { id, title, content, public_test_cases, private_test_cases } =
                validatedTaskTemplateUpdateBody;

            const existingTaskTemplate = await prisma.taskTemplate.findFirst({
                where: {
                    id: {
                        not: id,
                    },
                    title,
                },
            });

            if (existingTaskTemplate) {
                throw new TaskTemplateExistsError();
            }

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
}

const taskTemplateController = new TaskTemplateController();
export default taskTemplateController;
