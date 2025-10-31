import { badRequest, error, handleError, success } from '@/lib/responses';
import TaskTemplateService from '@/lib/services/task-template.service';
import { type NextRequest } from 'next/server';
import { updateTaskTemplateSchema } from '@/lib/schemas/taskTemplate.schema';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const result = await TaskTemplateService.getTaskTemplate((await params).id);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const result = await TaskTemplateService.deleteTaskTemplate((await params).id);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const parsed = updateTaskTemplateSchema.safeParse({ id: (await params).id, ...body });
        if (!parsed.success)
            return Response.json(badRequest('Invalid task template data', parsed.error));

        const result = await TaskTemplateService.updateTaskTemplate(parsed.data);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
