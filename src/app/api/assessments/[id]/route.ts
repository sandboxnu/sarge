import AssessmentService from '@/lib/services/assessment.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/dist/server/web/spec-extension/request';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const result = await AssessmentService.getAssessmentWithRelations(id);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await AssessmentService.deleteAssessment(id);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const parsed = { id, ...body };
        const updatedAssessment = await AssessmentService.updateAssessment(parsed);
        return Response.json({ data: updatedAssessment }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
