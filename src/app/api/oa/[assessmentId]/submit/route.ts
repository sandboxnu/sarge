import AssessmentService from '@/lib/services/assessment.service';
import { handleError, UnauthorizedException } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const token = request.nextUrl.searchParams.get('token');

        if (!token) {
            throw new UnauthorizedException('Assessment access token is required');
        }

        await AssessmentService.submitAssessmentForCandidate(assessmentId, token);
        return Response.json({ data: null }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
