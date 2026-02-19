import { CreateAssessmentTemplateSchema } from '@/lib/schemas/assessment-template.schema';
import AssessmentTemplateService from '@/lib/services/assessment-template.service';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const parsed = CreateAssessmentTemplateSchema.parse(body);
        const result = await AssessmentTemplateService.createAssessmentTemplate({
            ...parsed,
            orgId: session.activeOrganizationId,
        });
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        const searchParams = request.nextUrl.searchParams;
        const pageParam = searchParams.get('page') ?? '0';
        const limitParam = searchParams.get('limit') ?? '10';

        const page = isNaN(parseInt(pageParam)) ? 0 : parseInt(pageParam);
        const limit = isNaN(parseInt(limitParam)) ? 10 : parseInt(limitParam);

        const result = await AssessmentTemplateService.getAssessmentTemplates(
            session.activeOrganizationId,
            page,
            limit
        );
        return Response.json({ data: result.data, total: result.total }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
