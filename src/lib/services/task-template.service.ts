import type { Prisma, TaskTemplate } from '@/generated/prisma';
import type {
    UpdateTaskTemplateDTO,
    CreateTaskTemplateDTO,
    TaskTemplateListItemDTO,
    TaskTemplateEditorDTO,
} from '@/lib/schemas/task-template.schema';
import { prisma } from '@/lib/prisma';
import { NotFoundException, ConflictException } from '@/lib/utils/errors.utils';
import { createDuplicateTitle } from '@/lib/utils/template.utils';

type TaskTemplateListQueryResult = Prisma.TaskTemplateGetPayload<{
    include: {
        tags: true;
        languages: true;
        author: { select: { id: true; name: true } };
        _count: { select: { assessments: true } };
    };
}>;

function toTaskTemplateListItem(template: TaskTemplateListQueryResult): TaskTemplateListItemDTO {
    const { author, _count, ...rest } = template;

    return {
        ...rest,
        author,
        assessmentTemplatesCount: _count.assessments,
    } as TaskTemplateListItemDTO;
}

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
                languages: true,
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

    const data = templates.map(toTaskTemplateListItem);

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
            languages: {
                create: [
                    {
                        language: 'python',
                        solution: '',
                        stub: '',
                    },
                ],
            },
        },
    });
    return createdTaskTemplate;
}

async function duplicateTaskTemplate(
    sourceId: string,
    orgId: string,
    authorId: string
): Promise<TaskTemplateListItemDTO> {
    const source = await prisma.taskTemplate.findFirst({
        where: { id: sourceId, orgId },
        include: {
            tags: { select: { id: true } },
            languages: {
                select: {
                    language: true,
                    solution: true,
                    stub: true,
                },
            },
        },
    });

    if (!source) {
        throw new NotFoundException('Task Template', sourceId);
    }

    const newTitle = await createDuplicateTitle(source.title, 'task-template', orgId);

    const created = await prisma.taskTemplate.create({
        data: {
            title: newTitle,
            description: source.description as Prisma.InputJsonValue,
            publicTestCases: source.publicTestCases as Prisma.InputJsonValue[],
            privateTestCases: source.privateTestCases as Prisma.InputJsonValue[],
            taskType: source.taskType,
            orgId,
            authorId,
            tags: {
                connect: source.tags,
            },
            languages: {
                create: source.languages,
            },
        },
        include: {
            tags: true,
            languages: true,
            author: { select: { id: true, name: true } },
            _count: { select: { assessments: true } },
        },
    });

    return toTaskTemplateListItem(created);
}

async function deleteTaskTemplate(id: string, orgId: string): Promise<TaskTemplate> {
    const existingTemplate = await prisma.taskTemplate.findFirst({
        where: { id, orgId },
    });

    if (!existingTemplate) {
        throw new NotFoundException('Task Template', id);
    }

    const [, deletedTaskTemplate] = await prisma.$transaction([
        prisma.taskTemplateLanguage.deleteMany({
            where: {
                taskTemplateId: id,
            },
        }),
        prisma.taskTemplate.delete({
            where: {
                id,
            },
        }),
    ]);

    return deletedTaskTemplate;
}

async function updateTaskTemplate(
    taskTemplate: UpdateTaskTemplateDTO & { orgId: string }
): Promise<TaskTemplate> {
    const { id, title, description, publicTestCases, privateTestCases, orgId } = taskTemplate;

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
            description,
            publicTestCases,
            privateTestCases,
        },
    });
    return updatedTaskTemplate;
}

async function getTaskTemplatesByTitle(
    title: string,
    orgId: string
): Promise<TaskTemplateListItemDTO[]> {
    const templates = await prisma.taskTemplate.findMany({
        where: {
            orgId,
            title: {
                contains: title,
                mode: 'insensitive',
            },
        },
        include: {
            tags: true,
            languages: true,
            author: { select: { id: true, name: true } },
            _count: { select: { assessments: true } },
        },
    });

    return templates.map(toTaskTemplateListItem);
}

async function getDuplicateTitle(title: string, orgId: string): Promise<string> {
    const titleExists = await prisma.taskTemplate.findFirst({
        where: {
            orgId,
            title: {
                equals: title,
                mode: 'insensitive',
            },
        },
    });

    if (!titleExists) return title;

    const newTitle = await createDuplicateTitle(title, 'task-template', orgId);
    return newTitle;
}

const TaskTemplateService = {
    getTaskTemplate,
    getTaskTemplates,
    createTaskTemplate,
    duplicateTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
    getTaskTemplatesByTitle,
    getDuplicateTitle,
};

export default TaskTemplateService;
