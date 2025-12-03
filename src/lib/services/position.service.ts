import { prisma } from '@/lib/prisma';
import { type CreatePositionDTO, type UpdatePositionDTO } from '@/lib/schemas/position.schema';
import { type Position } from '@/generated/prisma';
import { AssessmentStatus } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';
import { type PositionWithCounts } from '@/lib/types/position.types';

async function createPosition(
    positionRequest: CreatePositionDTO,
    userId: string,
    orgId: string
): Promise<Position> {
    const position = await prisma.position.create({
        data: {
            title: positionRequest.title,
            createdById: userId,
            orgId,
        },
    });

    return position;
}

async function deletePosition(positionId: string): Promise<Position> {
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    const deleted = await prisma.position.delete({ where: { id: positionId } });
    return deleted;
}

async function getPosition(positionId: string): Promise<Position> {
    const position = await prisma.position.findUnique({
        where: {
            id: positionId,
        },
    });

    if (!position) {
        throw new NotFoundException('Position', positionId);
    }

    return position;
}

async function getPositionByOrgId(orgId: string): Promise<PositionWithCounts[]> {
    const positions = await prisma.position.findMany({
        where: { orgId },
        select: {
            id: true,
            title: true,
            _count: {
                select: {
                    poolCandidates: true,
                },
            },
            createdAt: true,
            poolCandidates: {
                where: { assessmentStatus: AssessmentStatus.ASSIGNED },
                select: { id: true },
            },
        },
    });

    return positions.map((p) => ({
        id: p.id,
        title: p.title,
        numCandidates: p._count.poolCandidates,
        numAssigned: p.poolCandidates.length,
        createdAt: p.createdAt,
    }));
}

async function updatePosition(
    positionId: string,
    positionData: UpdatePositionDTO
): Promise<Position> {
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) {
        throw new NotFoundException('Position', positionId);
    }

    const updatedPosition = await prisma.position.update({
        where: { id: positionId },
        data: positionData,
    });
    return updatedPosition;
}

const PositionService = {
    createPosition,
    deletePosition,
    getPosition,
    getPositionByOrgId,
    updatePosition,
};

export default PositionService;
