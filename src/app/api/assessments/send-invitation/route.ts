import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { sendAssessmentInvitationEmail } from '@/lib/services/assessment-invitation-email.service';

const sendAssessmentInvitationSchema = z.object({
    candidateId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const body = await request.json();
        const { candidateId } = sendAssessmentInvitationSchema.parse(body);

        const result = await sendAssessmentInvitationEmail(
            candidateId,
            session.activeOrganizationId
        );

        return Response.json(
            {
                data: result,
            },
            { status: 200 }
        );
    } catch (err) {
        return handleError(err);
    }
}
