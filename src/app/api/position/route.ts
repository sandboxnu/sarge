import PositionService from '@/lib/services/position.service';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { type NextRequest } from 'next/server';
import { CreatePositionSchema } from '@/lib/schemas/position.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = CreatePositionSchema.safeParse(body);
        if (!parsed.success) return badRequest('Invalid position data', parsed.error);

        const result = await PositionService.createPosition(parsed.data);
        if (!result.success) return error(result.message, result.status);
        return success(result.data, 201);
    } catch (err) {
        return handleError(err);
    }
}
