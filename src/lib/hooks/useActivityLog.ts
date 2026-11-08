import { useMemo, useState } from 'react';
import type { Snapshot } from '@/generated/prisma';
import { buildActivityEvents, type ActivityEvent } from '@/lib/utils/activity-log.utils';

export function useActivityLog(snapshots: Snapshot[], startedAt: Date, submittedAt: Date | null) {
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const durationMs = useMemo(() => {
        const endedAt = submittedAt ?? snapshots.at(-1)?.createdAt ?? startedAt;
        return Math.max(0, endedAt.getTime() - startedAt.getTime());
    }, [snapshots, startedAt, submittedAt]);

    const events = useMemo(
        () => buildActivityEvents(snapshots, startedAt, durationMs),
        [snapshots, startedAt, durationMs]
    );

    const selectedEvent: ActivityEvent | null =
        events.find((event) => event.id === selectedEventId) ?? null;

    function selectEvent(id: string | null) {
        setSelectedEventId((current) => (current === id ? null : id));
    }

    return {
        events,
        durationMs,
        selectedEvent,
        selectEvent,
    };
}
