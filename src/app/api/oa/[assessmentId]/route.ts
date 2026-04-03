import AssessmentService from '@/lib/services/assessment.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const result = await AssessmentService.getAssessmentForCandidate(assessmentId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
