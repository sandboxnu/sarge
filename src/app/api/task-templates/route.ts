import { type NextRequest } from 'next/server';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { createTaskTemplateSchema } from '@/lib/schemas/task-template.schema';
import { getSession } from '@/lib/utils/auth.utils';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const body = await request.json();
        const parsed = createTaskTemplateSchema.parse(body);
        const result = await TaskTemplateService.createTaskTemplate({
            ...parsed,
            authorId: session.userId,
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

        const result = await TaskTemplateService.getAllTaskTemplates(
            session.activeOrganizationId,
            page,
            limit
        );
        return Response.json({ data: result.data, total: result.total }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
