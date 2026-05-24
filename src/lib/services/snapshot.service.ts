import { prisma } from '@/lib/prisma';
import { SnapshotType, type Snapshot } from '@/generated/prisma';
import { BadRequestException, NotFoundException } from '@/lib/utils/errors.utils';

async function createForCandidate(
    taskId: string,
    type: SnapshotType,
    content?: string
): Promise<Snapshot> {
    if (type === SnapshotType.CONTENT && !content) {
        throw new BadRequestException('CONTENT snapshots must include content');
    }
    if (type !== SnapshotType.CONTENT && content) {
        throw new BadRequestException('Only CONTENT snapshots may include content');
    }

    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true },
    });

    if (!task) {
        throw new NotFoundException('Task', taskId);
    }

    return prisma.snapshot.create({
        data: {
            taskId,
            type,
            content: content ?? null,
        },
    });
}

// Called by the WS server (via the internal endpoint) when a candidate's socket
// closes. Resolves the candidate's most recently started, not-yet-submitted Task
// and writes a DISCONNECT snapshot against it. No-op if the candidate has no
// task in flight (e.g. they disconnected from the intro page).
async function createDisconnectSnapshot(candidateEmail: string): Promise<Snapshot | null> {
    const task = await prisma.task.findFirst({
        where: {
            submittedAt: null,
            assessment: {
                application: {
                    assessmentStatus: 'IN_PROGRESS',
                    candidate: { email: candidateEmail },
                },
            },
        },
        orderBy: { startedAt: 'desc' },
        select: { id: true },
    });

    if (!task) return null;

    return prisma.snapshot.create({
        data: { taskId: task.id, type: SnapshotType.DISCONNECT },
    });
}

const SnapshotService = {
    createForCandidate,
    createDisconnectSnapshot,
};

export default SnapshotService;
