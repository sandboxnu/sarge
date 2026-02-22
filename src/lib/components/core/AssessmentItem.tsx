'use client';

import { CodeXml, GripVertical, Type } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';
import { SortableItemHandle, useSortableItemContext } from '@/lib/components/ui/sortable';
import type { AssessmentSection } from '@/lib/types/assessment-section.types';

interface AssessmentItemProps {
    section: AssessmentSection;
    isSelected: boolean;
    onSelect: () => void;
}

export default function AssessmentItem({ section, isSelected, onSelect }: AssessmentItemProps) {
    const { isDragging } = useSortableItemContext('AssessmentItem');

    const SectionIcon = section.type === 'task' ? CodeXml : Type;
    const title = section.type === 'task' ? section.taskTemplate.title : '';
    const timeLimitMinutes = section.type === 'task' ? section.taskTemplate.timeLimitMinutes : 0;

    return (
        <div
            className={cn(
                'border-border group relative border-l px-5 py-1',
                isSelected && 'is-selected'
            )}
        >
            <SortableItemHandle
                className={cn(
                    'absolute top-1/2 left-0.5 -translate-y-1/2 opacity-0 transition-opacity',
                    isDragging && 'opacity-100',
                    !isSelected && !isDragging && 'group-hover:opacity-100'
                )}
            >
                <GripVertical className="text-sarge-gray-300 size-[15px]" />
            </SortableItemHandle>

            <div
                className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2',
                    isDragging
                        ? 'border-sarge-primary-200 bg-sarge-primary-100'
                        : isSelected
                          ? 'border-sarge-primary-100 bg-card'
                          : 'border-border hover:border-sarge-primary-100 hover:bg-card'
                )}
                onClick={onSelect}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <SectionIcon className="text-sarge-gray-700 size-5 shrink-0" />
                    <span className="text-label-xs truncate">{title}</span>
                </div>

                {timeLimitMinutes > 0 && (
                    <span className="text-label-xs ml-2 shrink-0">{timeLimitMinutes}min</span>
                )}
            </div>
        </div>
    );
}
