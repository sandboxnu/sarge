import { type NextRequest } from 'next/server';
import PositionService from '@/lib/services/position.service';
import { handleError } from '@/lib/utils/errors.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const orgId = (await params).id;
        const positionsResult = await PositionService.getPositionByOrgId(orgId);
        return Response.json({ data: positionsResult }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
