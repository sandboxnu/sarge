import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { createTaskTemplateSchema } from '@/lib/schemas/task-template.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createTaskTemplateSchema.parse(body);
        const result = await TaskTemplateService.createTaskTemplate(parsed);
        return Response.json({ success: true, data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
