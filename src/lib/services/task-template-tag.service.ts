import { prisma } from '@/lib/prisma';
import { type TaskTemplateTag } from '@/generated/prisma';

async function getTaskTemplateTagsByOrgId(orgId: string): Promise<TaskTemplateTag[]> {
    return prisma.taskTemplateTag.findMany({
        where: { orgId },
        orderBy: { name: 'asc' },
    });
}

async function createTaskTemplateTag(
    name: string,
    orgId: string,
    colorHexCode: string
): Promise<TaskTemplateTag> {
    return prisma.taskTemplateTag.create({
        data: {
            name,
            orgId,
            colorHexCode,
        },
    });
}

const TaskTemplateTagService = { getTaskTemplateTagsByOrgId, createTaskTemplateTag };
export default TaskTemplateTagService;
