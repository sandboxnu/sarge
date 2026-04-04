import { prisma } from '@/lib/prisma';
import { type PositionTag } from '@/generated/prisma';

async function getPositionTagsByOrgId(orgId: string): Promise<PositionTag[]> {
    return prisma.positionTag.findMany({
        where: { orgId },
        orderBy: { name: 'asc' },
    });
}

async function createPositionTag(name: string, orgId: string, colorHexCode: string): Promise<PositionTag> {
    return prisma.positionTag.create({
        data: {
            name,
            orgId,
            colorHexCode,
        },
    });
}

const PositionTagService = { getPositionTagsByOrgId, createPositionTag };
export default PositionTagService;