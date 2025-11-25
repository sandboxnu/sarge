import { CreateTaskSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function POST(requst: NextRequest) {
    try {
        const body = await requst.json();
        const parsed = CreateTaskSchema.parse(body);
        const result = await taskService.createTask(parsed);
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
