import { positionController } from '@/lib/controllers/position.controller';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidUserInputError } from '@/lib/schemas/errors';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const position = await positionController.create(body);
        return sargeApiResponse(position, 200);
    } catch (error) {
        if (error instanceof InvalidUserInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
