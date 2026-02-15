import { UpdateTaskSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function GET(_requst: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const { id } = await params;
        const result = await taskService.getTask(id, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(_req.headers);
        const { id } = await params;
        const result = await taskService.deleteTask(id, session.activeOrganizationId);
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
        const parsed = UpdateTaskSchema.parse({ id, ...body });
        const result = await taskService.updateTask(parsed, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
