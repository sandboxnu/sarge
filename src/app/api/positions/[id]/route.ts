import PositionService from '@/lib/services/position.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { updatePositionSchema } from '@/lib/schemas/position.schema';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const positionId = (await params).id;
        const result = await PositionService.getPosition(positionId, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(_request.headers);
        const positionId = (await params).id;
        const result = await PositionService.deletePosition(
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const positionId = (await params).id;
        const body = await request.json();
        const parsed = updatePositionSchema.parse(body);
        const result = await PositionService.updatePosition(
            positionId,
            parsed,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
