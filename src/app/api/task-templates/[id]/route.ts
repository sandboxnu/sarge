import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { type NextRequest } from 'next/server';
import { updateTaskTemplateSchema } from '@/lib/schemas/task-template.schema';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const taskTemplateId = (await params).id;
        const taskTemplate = await TaskTemplateService.getTaskTemplate(taskTemplateId);
        return Response.json({ data: taskTemplate }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const taskTemplateId = (await params).id;
        const deletedTaskTemplate = await TaskTemplateService.deleteTaskTemplate(taskTemplateId);
        return Response.json({ data: deletedTaskTemplate }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const taskTemplateId = (await params).id;
        const requestBody = await request.json();
        const parsed = updateTaskTemplateSchema.parse({ id: taskTemplateId, ...requestBody });
        const updatedTaskTemplate = await TaskTemplateService.updateTaskTemplate(parsed);
        return Response.json({ data: updatedTaskTemplate }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
