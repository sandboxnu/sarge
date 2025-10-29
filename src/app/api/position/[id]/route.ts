import PositionService from '@/lib/services/position.service';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { type NextRequest } from 'next/server';
import { CreatePositionSchema } from '@/lib/schemas/position.schema';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const result = await PositionService.getPosition(positionId);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const positionId = (await params).id;
        const result = await PositionService.deletePosition(positionId);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const positionData = await request.json();
        const parsed = CreatePositionSchema.partial().safeParse(positionData);
        if (!parsed.success)
            return Response.json(badRequest('Invalid position data', parsed.error));

        const result = await PositionService.updatePosition(positionId, parsed.data);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
