import { PositionController } from '@/lib/controllers/position.controller';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { PositionNotFoundError } from '@/lib/schemas/position.schema';
import { type NextRequest } from 'next/server';

const positionController = new PositionController();

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ positionId: string }> }
) {
    try {
        const userId = (await params).positionId;
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
