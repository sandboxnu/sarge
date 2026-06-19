import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import AssessmentService from '@/lib/services/assessment.service';
import { sendAssessmentInvitationSchema } from '@/lib/schemas/assessment.schema';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const body = await request.json();
        const { positionId, deadline } = sendAssessmentInvitationSchema.parse(body);

        const result = await AssessmentService.sendAssessmentInvitationsToPosition(
            positionId,
            session.activeOrganizationId,
            deadline
        );

        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
