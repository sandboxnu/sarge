import { prisma } from '@/lib/prisma';
import { type Tag } from '@/generated/prisma';

async function getTagsByOrgId(orgId: string): Promise<Tag[]> {
    return prisma.tag.findMany({
        where: { orgId },
        orderBy: { name: 'asc' },
    });
}

async function createTag(name: string, orgId: string, colorHexCode: string): Promise<Tag> {
    return prisma.tag.create({
        data: {
            name,
            orgId,
            colorHexCode,
        },
    });
}

const TagService = { getTagsByOrgId, createTag };
export default TagService;
