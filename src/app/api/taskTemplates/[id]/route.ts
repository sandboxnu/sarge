import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';
import {
    getTaskTemplate,
    deleteTaskTemplate,
    updateTaskTemplate,
} from '@/lib/services/task-template.service';
import { TaskTemplateNotFoundError } from '@/lib/schemas/taskTemplate.schema';
import { type NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const foundTaskTemplate = await getTaskTemplate(await params);
        return sargeApiResponse(foundTaskTemplate, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        if (error instanceof TaskTemplateNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const deletedTaskTemplate = await deleteTaskTemplate(await params);
        return sargeApiResponse(deletedTaskTemplate, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        if (error instanceof TaskTemplateNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const idWithBody = { id: (await params).id, ...body };
        const taskTemplate = await updateTaskTemplate(idWithBody);
        return sargeApiResponse(taskTemplate, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
