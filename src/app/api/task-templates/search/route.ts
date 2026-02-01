import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { getSession } from '@/lib/utils/auth.utils';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        const orgId = session.activeOrganizationId;

        const searchParams = request.nextUrl.searchParams;

        const title = searchParams.get('title');

        if (!title) {
            const result = await TaskTemplateService.getAllTaskTemplates(orgId, 0, 1000);
            return Response.json({ data: result.data }, { status: 200 });
        }

        const taskTemplates = await TaskTemplateService.getTaskTemplatesByTitle(title, orgId);
        return Response.json({ data: taskTemplates }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
