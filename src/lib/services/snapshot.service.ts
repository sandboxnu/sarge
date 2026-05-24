import { prisma } from '@/lib/prisma';
import { SnapshotType, type Snapshot } from '@/generated/prisma';
import { NotFoundException } from '@/lib/utils/errors.utils';

async function createForCandidate(
    taskId: string,
    type: SnapshotType,
    content?: string
): Promise<Snapshot> {
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

// Called by WS server
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
