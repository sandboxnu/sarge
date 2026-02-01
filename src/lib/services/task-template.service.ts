import type { TaskTemplate } from '@/generated/prisma';
import type {
    UpdateTaskTemplateDTO,
    CreateTaskTemplateDTO,
    TaskTemplateWithTagsDTO,
    TaskTemplatePreviewDTO,
} from '@/lib/schemas/task-template.schema';
import { prisma } from '@/lib/prisma';
import { NotFoundException, ConflictException } from '@/lib/utils/errors.utils';

async function getTaskTemplate(taskTemplateId: string): Promise<TaskTemplate> {
    const taskTemplate = await prisma.taskTemplate.findFirst({
        where: { id: taskTemplateId },
        include: { tags: true },
    });

    if (!taskTemplate) {
        throw new NotFoundException('Task Template', taskTemplateId);
    }

    return taskTemplate;
}

async function getTaskTemplateForPreview(taskTemplateId: string): Promise<TaskTemplatePreviewDTO> {
    const taskTemplate = await prisma.taskTemplate.findFirst({
        where: { id: taskTemplateId },
        include: {
            tags: true,
            creator: { select: { id: true, name: true } },
            _count: { select: { assessments: true } },
        },
    });

    if (!taskTemplate) {
        throw new NotFoundException('Task Template', taskTemplateId);
    }

    const { _count, ...rest } = taskTemplate;
    return {
        ...rest,
        creator: taskTemplate.creator,
        assessmentTemplatesCount: _count.assessments,
    } as TaskTemplatePreviewDTO;
}

async function getAllTaskTemplates(
    orgId: string,
    page: number,
    limit: number
): Promise<{ data: TaskTemplateWithTagsDTO[]; total: number }> {
    const [templates, total] = await prisma.$transaction([
        prisma.taskTemplate.findMany({
            where: { orgId },
            include: { tags: true },
            skip: page * limit,
            take: limit,
        }),
        prisma.taskTemplate.count({ where: { orgId } }),
    ]);
    return {
        data: templates as TaskTemplateWithTagsDTO[],
        total,
    };
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

async function duplicateTaskTemplate(taskTemplateId: string): Promise<TaskTemplate> {
    const sourceTaskTemplate = await prisma.taskTemplate.findUnique({
        where: { id: taskTemplateId },
        include: { tags: true },
    });
    if (!sourceTaskTemplate) throw new NotFoundException('Task Template', taskTemplateId);

    const duplicatedTaskTemplate = await prisma.taskTemplate.create({
        data: {
            title: `Copy of ${sourceTaskTemplate.title}`,
            orgId: sourceTaskTemplate.orgId,
            content: sourceTaskTemplate.content,
            publicTestCases: sourceTaskTemplate.publicTestCases as object[],
            privateTestCases: sourceTaskTemplate.privateTestCases as object[],
            taskType: sourceTaskTemplate.taskType,
            supportedLanguages: sourceTaskTemplate.supportedLanguages,
            createdById: sourceTaskTemplate.createdById,
            tags: { connect: sourceTaskTemplate.tags.map((tag) => ({ id: tag.id })) },
        },
    });
    return duplicatedTaskTemplate;
}

async function deleteTaskTemplate(taskTemplateId: string): Promise<TaskTemplate> {
    const taskTemplateToDelete = await prisma.taskTemplate.findUnique({
        where: { id: taskTemplateId },
    });

    if (!taskTemplateToDelete) {
        throw new NotFoundException('Task Template', taskTemplateId);
    }

    return prisma.taskTemplate.delete({
        where: { id: taskTemplateId },
    });
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

const TaskTemplateService = {
    getTaskTemplate,
    getTaskTemplateForPreview,
    getAllTaskTemplates,
    createTaskTemplate,
    duplicateTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
    getTaskTemplatesByTitle,
};

export default TaskTemplateService;
