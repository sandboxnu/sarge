import AssessmentService from '@/lib/services/assessment.service';
import CandidatePoolService from '@/lib/services/candidate-pool.service';
import { handleError } from '@/lib/utils/errors.utils';
import type { NextRequest } from 'next/dist/server/web/spec-extension/request';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const assessment = await AssessmentService.getAssessmentWithRelations(id);
        const result = await CandidatePoolService.getAssessmentStatus(
            assessment.candidatePoolEntryId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const assessment = await AssessmentService.getAssessmentWithRelations(id);
        const result = await CandidatePoolService.updateAssessmentStatus({
            id: assessment.candidatePoolEntryId,
            ...body,
        });
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
