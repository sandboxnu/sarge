import { getPosition, deletePosition, updatePosition } from '@/lib/services/position.service';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { PositionNotFoundError } from '@/lib/schemas/position.schema';
import { type NextRequest } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = (await params).id;
        const user = await getPosition(userId);
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
        const deletedPosition = await deletePosition(positionId);
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

        const updatedPosition = await updatePosition(positionId, positionData);
        return sargeApiResponse(updatedPosition, 200);
    } catch (error) {
        if (error instanceof PositionNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
