import PositionService from '@/lib/services/position.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { updatePositionSchema } from '@/lib/schemas/position.schema';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const result = await PositionService.getPosition(positionId);
        return Response.json({ success: true, data: result }, { status: 200 });
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
        return Response.json({ success: true, data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const body = await request.json();
        const parsed = updatePositionSchema.parse(body);
        const result = await PositionService.updatePosition(positionId, parsed);
        return Response.json({ success: true, data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
