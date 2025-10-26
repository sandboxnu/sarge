import PositionService from '@/lib/services/position.service';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const position = await PositionService.createPosition(body);
        return sargeApiResponse(position, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
