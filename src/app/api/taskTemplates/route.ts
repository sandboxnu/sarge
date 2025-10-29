import { type NextRequest } from 'next/server';
import { badRequest, error, handleError, success } from '@/lib/responses';
import TaskTemplateService from '@/lib/services/task-template.service';
import { createTaskTemplateSchema } from '@/lib/schemas/taskTemplate.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createTaskTemplateSchema.safeParse(body);
        if (!parsed.success)
            return Response.json(badRequest('Invalid task template data', parsed.error));

        const result = await TaskTemplateService.createTaskTemplate(parsed.data);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 201));
    } catch (err) {
        return handleError(err);
    }
}
