import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import PositionService from '@/lib/services/position.service';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const positionId = (await params).id;
        const result = await PositionService.unarchivePosition(
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
