'use client';

import { SquarePen, Trash2, X } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { cn } from '@/lib/utils/cn.utils';

interface CandidateSelectionMenuProps {
    selectedCount: number;
    onDelete: () => void;
    onDeselectAll: () => void;
}

// TODO: no endpoint exists yet to update these properties, so selecting one is a no-op
const editableProperties = ['Assessment', 'Grader', 'Decision'];

const actionButtonClass = 'h-10 gap-2 pr-5 pl-4';

export function CandidateSelectionMenu({
    selectedCount,
    onDelete,
    onDeselectAll,
}: CandidateSelectionMenuProps) {
    if (selectedCount === 0) return null;

    return (
        // Absolute to the layout's `SidebarInset` (the nearest positioned ancestor), so it stays
        // pinned to the bottom of the content area and centered over it, regardless of scroll
        <div
            role="toolbar"
            aria-label="Selected candidates"
            className="bg-sarge-gray-0 border-sarge-gray-200 animate-section-enter absolute inset-x-8 bottom-6 z-20 mx-auto flex max-w-[855px] items-center justify-between rounded-lg border py-2 pl-6 shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.12)]"
        >
            <span className="text-label-s text-sarge-gray-900">
                {selectedCount} {selectedCount === 1 ? 'candidate' : 'candidates'} selected
            </span>

            <div className="flex items-center">
                <Button variant="icon" className={actionButtonClass} onClick={onDelete}>
                    <Trash2 />
                    Delete
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="icon"
                            className={cn(
                                actionButtonClass,
                                'data-[state=open]:bg-sarge-primary-100'
                            )}
                        >
                            <SquarePen />
                            Edit property
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="center" sideOffset={16} className="w-50">
                        {editableProperties.map((property) => (
                            <DropdownMenuItem key={property}>{property}</DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="icon" className={actionButtonClass} onClick={onDeselectAll}>
                    <X />
                    Deselect all
                </Button>
            </div>
        </div>
    );
}
