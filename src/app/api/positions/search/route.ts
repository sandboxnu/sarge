import PositionService from '@/lib/services/position.service';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        const orgId = session.activeOrganizationId;

        const searchParams = request.nextUrl.searchParams;

        const title = searchParams.get('title');

        if (!title) {
            const positions = await PositionService.getAllPositions(orgId);
            return Response.json({ data: positions }, { status: 200 });
        }

        const positions = await PositionService.getPositionsByTitle(title, orgId);
        return Response.json({ data: positions }, { status: 200 });
    } catch (err) {
        handleError(err);
    }
}
