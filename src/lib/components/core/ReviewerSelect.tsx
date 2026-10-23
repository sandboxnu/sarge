'use client';

import { ChevronDown, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/Popover';
import { Checkbox } from '@/lib/components/ui/Checkbox';

type Reviewer = { id: string; name: string };

type ReviewerSelectProps = {
    options: Reviewer[];
    selected: Reviewer[];
    onChange: (reviewerIds: string[]) => void;
};

export function ReviewerSelect({ options, selected, onChange }: ReviewerSelectProps) {
    const selectedIds = selected.map((r) => r.id);
    const label =
        selected.length === 0
            ? 'Select reviewer(s)'
            : selected.length === 1
              ? selected[0].name
              : `${selected.length} people`;

    const toggle = (id: string) =>
        onChange(
            selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]
        );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="border-sarge-gray-200 bg-sarge-gray-0 hover:bg-sarge-gray-100 flex h-11 w-[200px] items-center gap-2 rounded-lg border px-3 py-2 hover:cursor-pointer"
                >
                    <User className="text-sarge-gray-600 size-5 shrink-0" />
                    <span className="text-label-s text-sarge-gray-800 flex-1 truncate text-left">
                        {label}
                    </span>
                    <ChevronDown className="text-sarge-gray-600 size-5 shrink-0" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[240px] p-1">
                {options.length === 0 && (
                    <p className="text-body-s text-sarge-gray-600 p-2">No reviewers available</p>
                )}
                {options.map((option) => (
                    <label
                        key={option.id}
                        className="hover:bg-sarge-gray-100 flex cursor-pointer items-center gap-2 rounded-lg p-2"
                    >
                        <Checkbox
                            checked={selectedIds.includes(option.id)}
                            onCheckedChange={() => toggle(option.id)}
                        />
                        <span className="text-label-s text-sarge-gray-800 truncate">
                            {option.name}
                        </span>
                    </label>
                ))}
            </PopoverContent>
        </Popover>
    );
}
