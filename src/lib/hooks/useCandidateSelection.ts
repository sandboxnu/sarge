import { useEffect, useState } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';

export default function useCandidateSelection(candidates: ApplicationDisplayInfo[]) {
    // { [candidateId]: true } — the shape TanStack's DataTable reads and writes
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Drop selections for rows that are no longer displayed (filtered out by search, or deleted)
    useEffect(() => {
        const displayedIds = new Set(candidates.map((c) => c.candidate.id));
        setRowSelection((prev) => {
            const selectedIds = Object.keys(prev).filter((id) => prev[id]);
            if (selectedIds.every((id) => displayedIds.has(id))) return prev;
            return Object.fromEntries(
                selectedIds.filter((id) => displayedIds.has(id)).map((id) => [id, true])
            );
        });
    }, [candidates]);

    const selectedCandidates = candidates.filter((c) => rowSelection[c.candidate.id]);

    const clearSelection = () => setRowSelection({});

    return {
        rowSelection,
        setRowSelection,
        selectedCandidates,
        selectedCount: selectedCandidates.length,
        clearSelection,
    };
}
