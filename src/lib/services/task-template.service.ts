import type { TaskTemplate } from '@/generated/prisma';
import type {
    UpdateTaskTemplateDTO,
    CreateTaskTemplateDTO,
    TaskTemplateListItemDTO,
    TaskTemplateEditorDTO,
} from '@/lib/schemas/task-template.schema';
import { prisma } from '@/lib/prisma';
import { NotFoundException, ConflictException } from '@/lib/utils/errors.utils';

async function getTaskTemplate(id: string, orgId: string): Promise<TaskTemplateEditorDTO> {
    const foundTaskTemplate = await prisma.taskTemplate.findFirst({
        where: {
            id,
            orgId,
        },
        include: {
            tags: true,
            languages: true,
        },
    });

    if (!foundTaskTemplate) {
        throw new NotFoundException('Task Template', id);
    }

    // TODO typecasting as TaskTemplateEditorDTO due to JsonValue[] in prisma
    // not including input and output fields
    return foundTaskTemplate as TaskTemplateEditorDTO;
}

async function getTaskTemplates(
    orgId: string,
    page?: number,
    limit?: number
): Promise<{ data: TaskTemplateListItemDTO[]; total: number }> {
    page = page ?? 0; // not sure if this is the kind of solution we are looking for (essentially grab all if not defined)
    limit = limit ?? Number.MAX_SAFE_INTEGER;

    const [templates, total] = await prisma.$transaction([
        prisma.taskTemplate.findMany({
            where: { orgId },
            include: {
                tags: true,
                author: { select: { id: true, name: true } },
                _count: { select: { assessments: true } },
            },
            skip: page * limit,
            take: limit,
        }),
        prisma.taskTemplate.count({
            where: { orgId },
        }),
    ]);

    const data = templates.map(({ author, _count, ...rest }) => ({
        ...rest,
        author,
        assessmentTemplatesCount: _count.assessments,
    })) as TaskTemplateListItemDTO[];

    return { data, total };
}

async function createTaskTemplate(
    taskTemplate: CreateTaskTemplateDTO & { authorId: string; orgId: string }
): Promise<TaskTemplate> {
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

async function deleteTaskTemplate(id: string, orgId: string): Promise<TaskTemplate> {
    const existingTemplate = await prisma.taskTemplate.findFirst({
        where: { id, orgId },
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

async function updateTaskTemplate(
    taskTemplate: UpdateTaskTemplateDTO & { orgId: string }
): Promise<TaskTemplate> {
    const { id, title, content, publicTestCases, privateTestCases, orgId } = taskTemplate;

    const current = await prisma.taskTemplate.findFirst({ where: { id, orgId } });
    if (!current) throw new NotFoundException('Task Template', id);

    const hasDuplicateName = await prisma.taskTemplate.findFirst({
        where: {
            orgId,
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
    getAllTaskTemplates: getTaskTemplates,
    createTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
    getTaskTemplatesByTitle,
};

export default TaskTemplateService;
