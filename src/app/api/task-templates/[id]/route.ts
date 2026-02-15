import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { type NextRequest } from 'next/server';
import { updateTaskTemplateSchema } from '@/lib/schemas/task-template.schema';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const id = (await params).id;
        const result = await TaskTemplateService.getTaskTemplate(id, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(_req.headers);
        const id = (await params).id;
        const result = await TaskTemplateService.deleteTaskTemplate(
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
        const id = (await params).id;
        const body = await request.json();
        const parsed = updateTaskTemplateSchema.parse({ id, ...body });
        const result = await TaskTemplateService.updateTaskTemplate({
            ...parsed,
            orgId: session.activeOrganizationId,
        });
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
