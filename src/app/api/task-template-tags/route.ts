import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateTagService from '@/lib/services/task-template-tag.service';
import { createTagSchema } from '@/lib/schemas/tag.schema';
import { getSession } from '@/lib/utils/auth.utils';

export async function GET() {
    try {
        const session = await getSession();
        const tags = await TaskTemplateTagService.getTaskTemplateTagsByOrgId(session.activeOrganizationId);
        return Response.json({ data: tags }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const body = await request.json();
        const parsed = createTagSchema.parse(body);

        const tag = await TaskTemplateTagService.createTaskTemplateTag(
            parsed.name,
            session.activeOrganizationId,
            parsed.colorHexCode
        );
        return Response.json({ data: tag }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
