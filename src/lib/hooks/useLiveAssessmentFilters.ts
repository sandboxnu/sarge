'use client';

import { useMemo, useState } from 'react';
import { type LiveAssessmentStatus, type LiveAssessmentSummary } from '@/lib/types/reviewing.types';

export type LiveAssessmentSortBy =
    | 'last-edited'
    | 'title-asc'
    | 'title-desc'
    | 'most-awaiting-review'
    | 'most-candidates';

export const LIVE_ASSESSMENT_SORT_OPTIONS: { value: LiveAssessmentSortBy; label: string }[] = [
    { value: 'last-edited', label: 'Last edited' },
    { value: 'title-asc', label: 'Position (A → Z)' },
    { value: 'title-desc', label: 'Position (Z → A)' },
    { value: 'most-awaiting-review', label: 'Most awaiting review' },
    { value: 'most-candidates', label: 'Most candidates' },
];

export const LIVE_ASSESSMENT_STATUS_OPTIONS: { value: LiveAssessmentStatus; label: string }[] = [
    { value: 'NOT_STARTED', label: 'Not started' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'COMPLETED', label: 'Complete' },
];

function lastEdited(item: LiveAssessmentSummary) {
    return new Date(item.lastActivityAt).getTime();
}

function compare(sortBy: LiveAssessmentSortBy, a: LiveAssessmentSummary, b: LiveAssessmentSummary) {
    switch (sortBy) {
        case 'last-edited':
            if ((a.status === 'COMPLETED') !== (b.status === 'COMPLETED')) {
                return a.status === 'COMPLETED' ? 1 : -1;
            }
            return lastEdited(b) - lastEdited(a);
        case 'title-asc':
            return a.positionTitle.localeCompare(b.positionTitle);
        case 'title-desc':
            return b.positionTitle.localeCompare(a.positionTitle);
        case 'most-awaiting-review':
            return b.awaitingReviewCount - a.awaitingReviewCount || lastEdited(b) - lastEdited(a);
        case 'most-candidates':
            return b.candidateCount - a.candidateCount || lastEdited(b) - lastEdited(a);
    }
}

export default function useLiveAssessmentFilters(liveAssessments: LiveAssessmentSummary[]) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<LiveAssessmentSortBy>('last-edited');
    const [statusFilter, setStatusFilter] = useState<LiveAssessmentStatus[]>([]);
    const [awaitingReviewOnly, setAwaitingReviewOnly] = useState(false);

    function toggleStatusFilter(status: LiveAssessmentStatus) {
        setStatusFilter((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    }

    const activeFilterCount = statusFilter.length + (awaitingReviewOnly ? 1 : 0);

    const { active, archived } = useMemo(() => {
        const query = search.trim().toLowerCase();

        const visible = liveAssessments
            .filter(
                (item) =>
                    !query ||
                    item.positionTitle.toLowerCase().includes(query) ||
                    item.assessmentTemplateTitle.toLowerCase().includes(query)
            )
            .filter((item) => statusFilter.length === 0 || statusFilter.includes(item.status))
            .filter((item) => !awaitingReviewOnly || item.awaitingReviewCount > 0)
            .sort((a, b) => compare(sortBy, a, b));

        return {
            active: visible.filter((item) => !item.archived),
            archived: visible.filter((item) => item.archived),
        };
    }, [liveAssessments, search, sortBy, statusFilter, awaitingReviewOnly]);

    return {
        search,
        setSearch,
        sortBy,
        setSortBy,
        statusFilter,
        toggleStatusFilter,
        awaitingReviewOnly,
        setAwaitingReviewOnly,
        activeFilterCount,
        isFiltering: search.trim().length > 0 || activeFilterCount > 0,
        active,
        archived,
    };
}
