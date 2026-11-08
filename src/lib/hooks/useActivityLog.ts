import { useMemo, useState } from 'react';
import type { Snapshot } from '@/generated/prisma';
import {
    buildActivityEvents,
    getContentAtTime,
    type ActivityEvent,
} from '@/lib/utils/activity-log.utils';

export function useActivityLog(snapshots: Snapshot[], startedAt: Date, submittedAt: Date | null) {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const normalizedStartedAt = useMemo(() => new Date(startedAt), [startedAt]);
    const normalizedSnapshots = useMemo(
        () =>
            snapshots.map((snapshot) => ({ ...snapshot, createdAt: new Date(snapshot.createdAt) })),
        [snapshots]
    );

    const durationMs = useMemo(() => {
        const endedAt = submittedAt ?? normalizedSnapshots.at(-1)?.createdAt ?? normalizedStartedAt;
        return Math.max(0, new Date(endedAt).getTime() - normalizedStartedAt.getTime());
    }, [normalizedSnapshots, normalizedStartedAt, submittedAt]);

    const events = useMemo(
        () => buildActivityEvents(normalizedSnapshots, normalizedStartedAt, durationMs),
        [normalizedSnapshots, normalizedStartedAt, durationMs]
    );

    const selectedEvent: ActivityEvent | null =
        events.find((event) => event.id === selectedEventId) ?? null;

    // Code visible in the editor at the selected point in the timeline; null means
    // nothing is selected and the final submission should be shown instead.
    const previewContent: string | null = selectedEvent
        ? getContentAtTime(events, selectedEvent.startMs)
        : null;

    function selectEvent(id: string | null) {
        setSelectedEventId((current) => (current === id ? null : id));
    }

    return {
        events,
        durationMs,
        selectedEvent,
        selectEvent,
        previewContent,
    };
}
