import { SnapshotType } from '@/generated/prisma';
import { CreateSnapshotForCandidateSchema } from '@/lib/schemas/snapshot.schema';
import snapshotService from '@/lib/services/snapshot.service';
import { BadRequestException, handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ assessmentId: string; taskId: string }> }
) {
    try {
        const { taskId } = await params;
        const body = await request.json();
        const { type, content } = CreateSnapshotForCandidateSchema.parse(body);

        if (type === SnapshotType.CONTENT && !content) {
            throw new BadRequestException('CONTENT snapshots must include content');
        }
        if (type !== SnapshotType.CONTENT && content) {
            throw new BadRequestException('Only CONTENT snapshots may include content');
        }

        const snapshot = await snapshotService.createForCandidate(taskId, type, content);
        return Response.json({ data: snapshot }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
