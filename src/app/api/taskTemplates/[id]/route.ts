import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';
import taskTemplateController from '@/lib/controllers/taskTemplate.controller';
import { TaskTemplateNotFoundError } from '@/lib/schemas/taskTemplate.schema';
import { type NextRequest } from 'next/server';

type TaskTemplateIdParam = {
    params: {
        id: string;
    };
};

export async function GET(_req: NextRequest, { params }: TaskTemplateIdParam) {
    try {
        const foundTaskTemplate = await taskTemplateController.get(await params);
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

export async function DELETE(_req: NextRequest, { params }: TaskTemplateIdParam) {
    try {
        const deletedTaskTemplate = await taskTemplateController.delete(await params);
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

export async function PUT(request: NextRequest, { params }: TaskTemplateIdParam) {
    try {
        const body = await request.json();
        const idWithBody = { id: (await params).id, ...body };
        const taskTemplate = await taskTemplateController.update(idWithBody);
        return sargeApiResponse(taskTemplate, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
