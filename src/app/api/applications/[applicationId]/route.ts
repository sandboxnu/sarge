import ApplicationService from '@/lib/services/application.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ applicationId: string }> }
) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const { applicationId } = await params;
        const application = await ApplicationService.getApplicationForReview(
            applicationId,
            session.activeOrganizationId
        );
        return Response.json({ data: application }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
