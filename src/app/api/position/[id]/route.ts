import { positionController } from '@/lib/controllers/position.controller';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { PositionNotFoundError } from '@/lib/schemas/position.schema';
import { type NextRequest } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = (await params).id;
        const user = await positionController.get(userId);
        return sargeApiResponse(user, 200);
    } catch (error) {
        if (error instanceof PositionNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const positionId = (await params).id;
        const deletedPosition = await positionController.delete(positionId);
        return sargeApiResponse(deletedPosition, 200);
    } catch (error) {
        if (error instanceof PositionNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const positionData = await request.json();

        const updatedPosition = await positionController.update(positionId, positionData);
        return sargeApiResponse(updatedPosition, 200);
    } catch (error) {
        if (error instanceof PositionNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
