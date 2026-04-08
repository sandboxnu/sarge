import { prisma } from '@/lib/prisma';
import { type TaskTemplateTag, type PositionTag } from '@/generated/prisma';

async function getPositionTagsByOrgId(orgId: string): Promise<PositionTag[]> {
    return prisma.positionTag.findMany({
        where: { orgId },
        orderBy: { name: 'asc' },
    });
}

async function createPositionTag(
    name: string,
    orgId: string,
    colorHexCode: string
): Promise<PositionTag> {
    return prisma.positionTag.create({
        data: {
            name,
            orgId,
            colorHexCode,
        },
    });
}

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

const TagService = {
    getPositionTagsByOrgId,
    createPositionTag,
    getTaskTemplateTagsByOrgId,
    createTaskTemplateTag,
};
export default TagService;
