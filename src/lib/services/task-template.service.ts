import type { TaskTemplate } from '@/generated/prisma';
import type {
    UpdateTaskTemplateDTO,
    CreateTaskTemplateDTO,
    TaskTemplateWithTagsDTO,
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

async function getAllTaskTemplates(orgId: string): Promise<TaskTemplateWithTagsDTO[]> {
    const templates = await prisma.taskTemplate.findMany({
        where: {
            orgId,
        },
        include: {
            tags: true,
        },
    });
    /**
     * I put this here because there is a type issue between prisma and our zod schema
     * This is due to the fact that prisma has JsonValue while zod has a specific object structure
     */
    return templates as TaskTemplateWithTagsDTO[];
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
    const { id, title, content, publicTestCases, privateTestCases } = taskTemplate;

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
