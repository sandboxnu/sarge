import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import AssessmentTemplateService from '@/lib/services/assessment-template.service';
import { getSession } from '@/lib/utils/auth.utils';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        const orgId = session.activeOrganizationId;

        const searchParams = request.nextUrl.searchParams;

        const title = searchParams.get('title');

        if (!title) {
            const assessmentTemplates =
                await AssessmentTemplateService.getAssessmentTemplates(orgId);
            return Response.json({ data: assessmentTemplates }, { status: 200 });
        }

        const assessmentTemplates = await AssessmentTemplateService.getAssessmentTemplatesByTitle(
            title,
            orgId
        );
        return Response.json({ data: assessmentTemplates }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
