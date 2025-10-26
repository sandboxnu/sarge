import { prisma } from '@/lib/prisma';
import {
    CreatePositionSchema,
    PositionNotFoundError,
    type CreatePositionData,
} from '../schemas/position.schema';
import { type Position, Prisma } from '@/generated/prisma';
import { InvalidInputError } from '../schemas/errors';
import z from 'zod';

async function createPosition(position: CreatePositionData): Promise<Position> {
    try {
        const validatedPosition = CreatePositionSchema.parse(position);

        return await prisma.position.create({
            data: {
                title: validatedPosition.title,
                createdBy: validatedPosition.createdBy,
                orgId: validatedPosition.orgId,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new InvalidInputError();
        }
        throw error;
    }
}

async function deletePosition(positionId: string): Promise<Position> {
    try {
        const deletedPosition = await prisma.position.delete({
            where: {
                id: positionId,
            },
        });
        return deletedPosition;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
            throw new PositionNotFoundError();
        }
        throw error;
    }
}

async function getPosition(positionId: string): Promise<Position> {
    const position = await prisma.position.findUnique({
        where: {
            id: positionId,
        },
    });

    if (!position) {
        throw new PositionNotFoundError();
    }

    return position;
}

async function updatePosition(
    positionId: string,
    positionData: Partial<CreatePositionData>
): Promise<Position> {
    try {
        const validatedPosition = CreatePositionSchema.partial().parse(positionData);
        const updatedPosition = await prisma.position.update({
            where: { id: positionId },
            data: {
                ...validatedPosition,
                updatedAt: new Date(),
            },
        });
        return updatedPosition;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
            throw new PositionNotFoundError();
        }
        throw error;
    }
}

const PositionService = {
    createPosition,
    deletePosition,
    getPosition,
    updatePosition,
};

export default PositionService;
