import { SnapshotType, type Snapshot } from '@/generated/prisma';

export type ActivityEvent = {
    id: string;
    type: SnapshotType;
    startMs: number;
    endMs: number;
    createdAt: Date;
};

const EVENT_LABELS: Record<SnapshotType, string> = {
    META: 'Task',
    CONTENT: 'Writing code',
    DISCONNECT: 'Connection lost',
    COPYPASTE: 'Code pasted',
    HIGHLIGHT: 'Highlight attempt',
    UNFOCUS: 'Tab switched',
};

const EVENT_COLORS: Record<SnapshotType, string> = {
    META: 'bg-sarge-gray-600',
    CONTENT: 'bg-sarge-gray-600',
    DISCONNECT: 'bg-sarge-warning-400',
    COPYPASTE: 'bg-sarge-warning-500',
    HIGHLIGHT: 'bg-sarge-primary-400',
    UNFOCUS: 'bg-sarge-error-500',
};

// Point-in-time events render as a small fixed-width pill rather than a duration bar
const POINT_EVENT_TYPES: SnapshotType[] = [
    SnapshotType.DISCONNECT,
    SnapshotType.COPYPASTE,
    SnapshotType.HIGHLIGHT,
    SnapshotType.UNFOCUS,
];

export function getEventLabel(type: SnapshotType): string {
    return EVENT_LABELS[type];
}

export function getEventColor(type: SnapshotType): string {
    return EVENT_COLORS[type];
}

export function isPointEvent(type: SnapshotType): boolean {
    return POINT_EVENT_TYPES.includes(type);
}

export function formatTimestamp(ms: number): string {
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Builds the ordered list of timeline events spanning [0, durationMs], deriving
// CONTENT segment durations from the gap to the next snapshot of any type.
export function buildActivityEvents(
    snapshots: Snapshot[],
    startedAt: Date,
    durationMs: number
): ActivityEvent[] {
    const sorted = [...snapshots]
        .filter((s) => s.type !== SnapshotType.META)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return sorted.map((snapshot, i) => {
        const startMs = snapshot.createdAt.getTime() - startedAt.getTime();
        const next = sorted[i + 1];
        const endMs = isPointEvent(snapshot.type)
            ? startMs
            : (next ? next.createdAt.getTime() - startedAt.getTime() : durationMs);

        return {
            id: snapshot.id,
            type: snapshot.type,
            startMs: Math.min(Math.max(startMs, 0), durationMs),
            endMs: Math.min(Math.max(endMs, 0), durationMs),
            createdAt: snapshot.createdAt,
        };
    });
}
