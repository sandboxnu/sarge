import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import AssessmentService from '@/lib/services/assessment.service';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const body = await request.json();
        const { positionId } = body as { positionId: string };

        const result = await AssessmentService.sendAssessmentInvitationsToPosition(
            positionId,
            session.activeOrganizationId
        );

        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
