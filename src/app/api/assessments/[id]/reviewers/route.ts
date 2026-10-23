import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { updateAssessmentReviewersSchema } from '@/lib/schemas/assessment.schema';
import AssessmentService from '@/lib/services/assessment.service';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const { id } = await params;
        const { reviewerIds } = updateAssessmentReviewersSchema.parse(await request.json());

        const result = await AssessmentService.updateAssessmentReviewers(
            id,
            reviewerIds,
            session.activeOrganizationId
        );

        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
