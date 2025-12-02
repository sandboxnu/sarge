import { UpdateTaskSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function GET(_requst: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const result = await taskService.getTask(id);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const result = await taskService.deleteTask(id);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const parsed = UpdateTaskSchema.parse({ id, ...body });
        const result = await taskService.updateTask(parsed);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
