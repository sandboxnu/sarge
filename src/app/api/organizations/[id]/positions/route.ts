import { type NextRequest } from 'next/server';
import PositionService from '@/lib/services/position.service';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const orgId = (await params).id;
        if (session.activeOrganizationId !== orgId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }
        const positionsResult = await PositionService.getPositionsByOrgId(orgId);
        return Response.json({ data: positionsResult }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
