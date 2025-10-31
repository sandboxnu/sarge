import { prisma } from '@/lib/prisma';
import { type CreatePositionData } from '@/lib/schemas/position.schema';
import { type Position } from '@/generated/prisma';
import { type Result, notFound, success } from '@/lib/responses';

async function createPosition(position: CreatePositionData): Promise<Result<Position>> {
    const created = await prisma.position.create({
        data: {
            title: position.title,
            createdBy: position.createdBy,
            orgId: position.orgId,
        },
    });

    return success(created, 201);
}

async function deletePosition(positionId: string): Promise<Result<Position>> {
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) {
        return notFound('Position', positionId);
    }

    const deleted = await prisma.position.delete({ where: { id: positionId } });
    return success(deleted, 200);
}

async function getPosition(positionId: string): Promise<Result<Position>> {
    const position = await prisma.position.findUnique({
        where: {
            id: positionId,
        },
    });

    if (!position) {
        return notFound('Position', positionId);
    }

    return success(position, 200);
}

async function updatePosition(
    positionId: string,
    positionData: Partial<CreatePositionData>
): Promise<Result<Position>> {
    const existingPosition = await prisma.position.findUnique({ where: { id: positionId } });
    if (!existingPosition) {
        return notFound('Position', positionId);
    }

    const updated = await prisma.position.update({
        where: { id: positionId },
        data: {
            ...positionData,
            updatedAt: new Date(),
        },
    });
    return success(updated, 200);
}

const PositionService = {
    createPosition,
    deletePosition,
    getPosition,
    updatePosition,
};

export default PositionService;
