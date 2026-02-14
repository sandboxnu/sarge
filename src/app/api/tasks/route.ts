import { CreateTaskSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const body = await request.json();
        const parsed = CreateTaskSchema.parse(body);
        const result = await taskService.createTask(parsed, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
