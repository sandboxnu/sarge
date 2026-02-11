import AssessmentService from '@/lib/services/assessment.service';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/dist/server/web/spec-extension/request';
import { getSession } from '@/lib/utils/auth.utils';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const { id } = await params;
        const result = await AssessmentService.getAssessmentWithRelations(
            id,
            session.activeOrganizationId
        );
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
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const { id } = await params;
        const result = await AssessmentService.deleteAssessment(id, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const { id } = await params;
        const body = await request.json();
        const parsed = { id, ...body };
        const updatedAssessment = await AssessmentService.updateAssessment(
            parsed,
            session.activeOrganizationId
        );
        return Response.json({ data: updatedAssessment }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
