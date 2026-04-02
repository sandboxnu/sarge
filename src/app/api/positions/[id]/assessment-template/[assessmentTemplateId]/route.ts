import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import AssessmentService from '@/lib/services/assessment.service';

export async function PUT(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string; assessmentTemplateId: string }>;
    }
) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const { id, assessmentTemplateId } = await params;

        const result = await AssessmentService.assignTemplateToPosition({
            positionId: id,
            assessmentTemplateId,
            orgId: session.activeOrganizationId,
        });

        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
