'use client';

import { ArrowUpDown, CircleAlert, FileText, SlidersHorizontal, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Checkbox } from '@/lib/components/ui/Checkbox';
import { Search } from '@/lib/components/core/Search';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import useSelectAssessmentModal, { TIME_OPTIONS } from '@/lib/hooks/useSelectAssessmentModal';
import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';
import { cn } from '@/lib/utils/cn.utils';

type SelectAssessmentModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAssign: (assessmentTemplate: AssessmentTemplateListItemDTO) => Promise<boolean>;
};

type DateTimeFieldsProps = {
    label: string;
    date: string;
    time: string;
    onDateChange: (value: string) => void;
    onTimeChange: (value: string) => void;
    invalid: boolean;
    labelInvalid?: boolean;
};

function DateTimeFields({
    label,
    date,
    time,
    onDateChange,
    onTimeChange,
    invalid,
    labelInvalid,
}: DateTimeFieldsProps) {
    const fieldClass = invalid
        ? 'border-sarge-error-400 bg-sarge-error-50 text-sarge-error-500'
        : 'border-sarge-gray-200 bg-sarge-gray-0 text-sarge-gray-800';

    return (
        <div className="flex flex-col gap-3">
            <p
                className={cn(
                    'text-label-xs',
                    labelInvalid ? 'text-sarge-error-500' : 'text-sarge-gray-700'
                )}
            >
                {label}
            </p>
            <div className="flex items-center gap-2">
                <input
                    type="date"
                    aria-label={`${label} date`}
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                    className={cn(
                        'text-label-s h-11 w-[200px] rounded-lg border px-3 py-2 outline-none',
                        fieldClass
                    )}
                />
                <Select value={time} onValueChange={onTimeChange}>
                    <SelectTrigger
                        aria-label={`${label} time`}
                        className={cn('text-label-s h-11 w-[200px] px-3', fieldClass)}
                    >
                        <SelectValue placeholder="00:00 AM" />
                    </SelectTrigger>
                    <SelectContent>
                        {TIME_OPTIONS.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

export default function SelectAssessmentModal({
    open,
    onOpenChange,
    onAssign,
}: SelectAssessmentModalProps) {
    const m = useSelectAssessmentModal({ open, onOpenChange, onAssign });

    return (
        <Dialog open={open} onOpenChange={m.handleOpenChange}>
            <DialogContent className="gap-6 px-9 py-8 sm:max-w-[778px]" showCloseButton={false}>
                <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                        <DialogTitle className="text-label-l">Select Assessment</DialogTitle>
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={() => m.handleOpenChange(false)}
                            className="text-sarge-gray-800 hover:cursor-pointer"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                    {m.errorMessage && (
                        <div className="text-sarge-error-500 flex items-center gap-2" role="alert">
                            <CircleAlert className="size-5" />
                            <span className="text-label-s">{m.errorMessage}</span>
                        </div>
                    )}
                    <DialogDescription className="sr-only">
                        Choose an assessment and set when it opens and closes.
                    </DialogDescription>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <DateTimeFields
                            label="Open Assessment"
                            date={m.openDate}
                            time={m.openTime}
                            onDateChange={m.setOpenDate}
                            onTimeChange={m.setOpenTime}
                            invalid={m.openFieldsInvalid}
                            labelInvalid={m.openLabelInvalid}
                        />
                        <DateTimeFields
                            label="Close Assessment"
                            date={m.closeDate}
                            time={m.closeTime}
                            onDateChange={m.setCloseDate}
                            onTimeChange={m.setCloseTime}
                            invalid={m.closeFieldsInvalid}
                        />
                    </div>

                    <div className="flex flex-col gap-3.5">
                        <div className="flex items-center gap-2">
                            <div className="h-10 flex-1">
                                <Search
                                    value={m.search}
                                    onChange={(e) => m.setSearch(e.target.value)}
                                    placeholder="Type to search for an assessment"
                                    className="h-10"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="size-10"
                                aria-label="Filter"
                            >
                                <SlidersHorizontal className="size-5" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="size-10"
                                aria-label="Sort"
                                onClick={m.toggleSort}
                            >
                                <ArrowUpDown className="size-5" />
                            </Button>
                        </div>

                        <div
                            className={cn(
                                'max-h-[260px] overflow-y-auto rounded border',
                                m.templatesInvalid
                                    ? 'border-sarge-error-400'
                                    : 'border-sarge-gray-200'
                            )}
                        >
                            {m.loading && (
                                <p className="text-body-s text-sarge-gray-600 p-4">Loading...</p>
                            )}
                            {m.loadError && (
                                <p className="text-body-s text-sarge-error-700 p-4">
                                    {m.loadError}
                                </p>
                            )}
                            {!m.loading && !m.loadError && m.visibleTemplates.length === 0 && (
                                <p className="text-body-s text-sarge-gray-600 p-4">
                                    No assessments found
                                </p>
                            )}
                            {m.visibleTemplates.map((template) => {
                                const checked = m.selectedId === template.id;
                                const dimmed = !!m.selectedId && !checked;
                                return (
                                    <label
                                        key={template.id}
                                        className={cn(
                                            'border-sarge-gray-200 flex h-[51px] cursor-pointer items-center gap-[23px] border-b px-[18px] last:border-b-0',
                                            dimmed && 'bg-sarge-gray-100 opacity-50'
                                        )}
                                    >
                                        <Checkbox
                                            className="size-5"
                                            checked={checked}
                                            onCheckedChange={() => m.handleSelect(template.id)}
                                        />
                                        <span className="flex items-center gap-2">
                                            <FileText className="text-sarge-gray-600 size-5" />
                                            <span className="text-label-s text-sarge-gray-800 truncate">
                                                {template.title}
                                            </span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <Button
                        type="button"
                        variant="tertiary"
                        className="px-0"
                        onClick={() => m.handleOpenChange(false)}
                        disabled={m.submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-9 px-4"
                        onClick={m.handleAssign}
                        disabled={m.submitting}
                    >
                        {m.submitting ? 'Assigning...' : 'Assign'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
