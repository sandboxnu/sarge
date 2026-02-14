import { UpdateAssessmentTemplateSchema } from '@/lib/schemas/assessment-template.schema';
import AssessmentTemplateService from '@/lib/services/assessment-template.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const { id } = await params;
        const template = await AssessmentTemplateService.getAssessmentTemplate(
            id,
            session.activeOrganizationId
        );
        return Response.json({ data: template }, { status: 200 });
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
        await assertRecruiterOrAbove(_request.headers);
        const { id } = await params;
        const result = await AssessmentTemplateService.deleteAssessmentTemplate(
            id,
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
        await assertRecruiterOrAbove(request.headers);
        const { id } = await params;
        const body = await request.json();
        const parsed = UpdateAssessmentTemplateSchema.parse({ id, ...body });
        const updatedTemplate = await AssessmentTemplateService.updateAssessmentTemplate({
            ...parsed,
            orgId: session.activeOrganizationId,
        });
        return Response.json({ data: updatedTemplate }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
