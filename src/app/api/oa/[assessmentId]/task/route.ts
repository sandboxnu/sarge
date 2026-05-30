import { CreateTaskForCandidateSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const body = await request.json();
        const parsed = CreateTaskForCandidateSchema.parse(body);
        const task = await taskService.createForCandidate(assessmentId, parsed.taskTemplateId);
        return Response.json({ data: task }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
