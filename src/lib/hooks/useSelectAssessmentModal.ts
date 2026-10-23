'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAssessmentTemplateList } from '@/lib/api/assessment-templates';
import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';

type UseSelectAssessmentModalArgs = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAssign: (assessmentTemplate: AssessmentTemplateListItemDTO) => Promise<boolean>;
};

export type SortDirection = 'asc' | 'desc';

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    const period = hours < 12 ? 'AM' : 'PM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutes} ${period}`;
});

function toDateTime(date: string, time: string): Date | null {
    if (!date || !time) return null;
    const [clock, period] = time.split(' ');
    const [h, m] = clock.split(':').map(Number);
    const hours = (h % 12) + (period === 'PM' ? 12 : 0);
    const result = new Date(`${date}T00:00:00`);
    result.setHours(hours, m, 0, 0);
    return result;
}

export default function useSelectAssessmentModal({
    open,
    onOpenChange,
    onAssign,
}: UseSelectAssessmentModalArgs) {
    const [templates, setTemplates] = useState<AssessmentTemplateListItemDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openDate, setOpenDate] = useState('');
    const [openTime, setOpenTime] = useState('');
    const [closeDate, setCloseDate] = useState('');
    const [closeTime, setCloseTime] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;

        setSearch('');
        setSelectedId(null);
        setOpenDate('');
        setOpenTime('');
        setCloseDate('');
        setCloseTime('');
        setSubmitted(false);

        async function load() {
            try {
                setLoading(true);
                setLoadError(null);
                const response = await getAssessmentTemplateList(0, 100);
                setTemplates(response.data);
            } catch (err) {
                setLoadError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [open]);

    const visibleTemplates = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = query
            ? templates.filter((t) => t.title.toLowerCase().includes(query))
            : templates;
        return [...filtered].sort((a, b) =>
            sortDirection === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );
    }, [templates, search, sortDirection]);

    const missingOpen = !openDate || !openTime;
    const missingClose = !closeDate || !closeTime;
    const missingTemplate = !selectedId;
    const hasMissingFields = missingOpen || missingClose || missingTemplate;

    const openAt = toDateTime(openDate, openTime);
    const closeAt = toDateTime(closeDate, closeTime);
    const closeBeforeOpen = !!openAt && !!closeAt && closeAt <= openAt;

    let errorMessage: string | null = null;
    if (submitted) {
        if (hasMissingFields) errorMessage = 'Please fill out required fields.';
        else if (closeBeforeOpen)
            errorMessage = 'Close Assessment date cannot be before Open Assessment date.';
    }

    const handleOpenChange = (nextOpen: boolean) => {
        if (submitting) return;
        onOpenChange(nextOpen);
    };

    const handleSelect = (id: string) => setSelectedId((prev) => (prev === id ? null : id));

    const handleAssign = async () => {
        if (submitting) return;
        setSubmitted(true);
        if (hasMissingFields || closeBeforeOpen) return;

        const template = templates.find((t) => t.id === selectedId);
        if (!template) return;

        setSubmitting(true);
        try {
            const ok = await onAssign(template);
            if (ok) onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        visibleTemplates,
        loading,
        loadError,
        search,
        setSearch,
        sortDirection,
        toggleSort: () => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc')),
        selectedId,
        handleSelect,
        openDate,
        setOpenDate,
        openTime,
        setOpenTime,
        closeDate,
        setCloseDate,
        closeTime,
        setCloseTime,
        submitted,
        submitting,
        errorMessage,
        openFieldsInvalid: submitted && (missingOpen || closeBeforeOpen),
        closeFieldsInvalid: submitted && (missingClose || closeBeforeOpen),
        openLabelInvalid: submitted && closeBeforeOpen && !hasMissingFields,
        templatesInvalid: submitted && missingTemplate,
        handleOpenChange,
        handleAssign,
    };
}
