import AssessmentService from '@/lib/services/assessment.service';
import ApplicationService from '@/lib/services/application.service';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import type { NextRequest } from 'next/dist/server/web/spec-extension/request';
import { getSession } from '@/lib/utils/auth.utils';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const { id } = await params;
        const assessment = await AssessmentService.getAssessmentWithRelations(
            id,
            session.activeOrganizationId
        );
        const result = await ApplicationService.getAssessmentStatus(
            assessment.applicationId,
            session.activeOrganizationId
        );
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
        const assessment = await AssessmentService.getAssessmentWithRelations(
            id,
            session.activeOrganizationId
        );
        const result = await ApplicationService.updateAssessmentStatus({
            id: assessment.applicationId,
            ...body,
            orgId: session.activeOrganizationId,
        });
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
