import { UpdateAssessmentTemplateTasksSchema } from '@/lib/schemas/assessment-template.schema';
import AssessmentTemplateService from '@/lib/services/assessment-template.service';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const { id } = await params;
        const body = await request.json();
        const parsed = UpdateAssessmentTemplateTasksSchema.parse(body);

        await AssessmentTemplateService.updateAssessmentTemplateTasks(
            id,
            session.activeOrganizationId,
            parsed.tasks
        );

        return Response.json({ data: null }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const { id } = await params;

        await AssessmentTemplateService.getAssessmentTemplate(id, session.activeOrganizationId);
        const tasks = await AssessmentTemplateService.getAssessmentTemplateTaskOrder(id);

        return Response.json({ data: tasks }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
