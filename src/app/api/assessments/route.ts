import AssessmentService from '@/lib/services/assessment.service';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { createAssessmentSchema } from '@/lib/schemas/assessment.schema';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const body = await request.json();
        const parsed = createAssessmentSchema.parse(body);
        const result = await AssessmentService.createAssessment(
            parsed,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
