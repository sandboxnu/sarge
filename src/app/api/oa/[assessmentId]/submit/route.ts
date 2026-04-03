import AssessmentService from '@/lib/services/assessment.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function PUT(
    _request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        await AssessmentService.submitAssessmentForCandidate(assessmentId);
        return Response.json({ data: null }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
