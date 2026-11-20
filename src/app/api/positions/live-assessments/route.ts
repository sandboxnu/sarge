import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import PositionService from '@/lib/services/position.service';

export async function GET(_req: NextRequest) {
    try {
        const session = await getSession();
        const liveAssessments = await PositionService.getLiveAssessmentsByOrgId(
            session.activeOrganizationId,
            session.userId
        );

        return Response.json({ data: liveAssessments }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
