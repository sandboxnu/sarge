import { SubmitTaskForCandidateSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string; taskId: string }> }
) {
    try {
        const { taskId } = await params;
        const body = await request.json();
        const parsed = SubmitTaskForCandidateSchema.parse(body);
        const task = await taskService.submitForCandidate(taskId, parsed);
        return Response.json({ data: task }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
