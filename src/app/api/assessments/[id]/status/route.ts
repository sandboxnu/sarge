import AssessmentService from '@/lib/services/assessment.service';
import ApplicationService from '@/lib/services/application.service';
import { handleError } from '@/lib/utils/errors.utils';
import type { NextRequest } from 'next/dist/server/web/spec-extension/request';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const assessment = await AssessmentService.getAssessmentWithRelations(id);
        const result = await ApplicationService.getAssessmentStatus(assessment.applicationId);
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
        const result = await ApplicationService.updateAssessmentStatus({
            id: assessment.applicationId,
            ...body,
        });
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
