import { CreateSnapshotForCandidateSchema } from '@/lib/schemas/snapshot.schema';
import snapshotService from '@/lib/services/snapshot.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string; taskId: string }> }
) {
    try {
        const { taskId } = await params;
        const body = await request.json();
        const parsed = CreateSnapshotForCandidateSchema.parse(body);
        const snapshot = await snapshotService.createForCandidate(
            taskId,
            parsed.type,
            parsed.content
        );
        return Response.json({ data: snapshot }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
