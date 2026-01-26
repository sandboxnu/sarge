'use client';

import { ChevronLeft, Eye, Copy, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import {
    TASK_EDITOR_SECTIONS,
    type TaskEditorSectionId,
} from '@/lib/constants/task-editor.constants';
import { cn } from '@/lib/utils/cn.utils';

interface TaskEditorSidebarProps {
    currentSection: TaskEditorSectionId;
    onSectionChange: (id: TaskEditorSectionId) => void;
    onSave: () => void;
    isSaving: boolean;
    handlePreviewAsCandidate: () => void;
    handleDuplicateTask: () => void;
    handleNavigateToTaskLibrary: () => void;
    onDeleteClick: () => void;
}

export function TaskEditorSidebar({
    currentSection,
    onSectionChange,
    onSave,
    isSaving,
    handlePreviewAsCandidate,
    handleDuplicateTask,
    handleNavigateToTaskLibrary,
    onDeleteClick,
}: TaskEditorSidebarProps) {
    return (
        <aside className="flex w-52 flex-col border-r border-border bg-background">
            <div className="px-2 pt-3 pb-2">
                <Button asChild variant="link" className="text-label-xs w-full justify-start">
                    <Link
                        href="/crm/task-templates"
                        className="flex items-center gap-1.5"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavigateToTaskLibrary();
                        }}
                    >
                        <ChevronLeft className="size-4 shrink-0" />
                        <span>Task Library</span>
                    </Link>
                </Button>
            </div>

            <nav className="flex-1 space-y-1 px-2 pt-3 pb-2">
                {TASK_EDITOR_SECTIONS.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onSectionChange(id)}
                        className={cn(
                            'text-label-xs w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150',
                            currentSection === id
                                ? 'bg-sarge-primary-200 text-sarge-gray-800'
                                : 'text-sarge-gray-600 hover:bg-sarge-primary-100 hover:text-sarge-gray-800'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            <div className="mt-auto border-t border-border p-2">
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        onClick={onSave}
                        variant="primary"
                        size="md"
                        className="flex-1"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                className="h-10 w-10 shrink-0 p-0"
                                aria-label="More options"
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="top" className="w-48">
                            <DropdownMenuItem onSelect={handlePreviewAsCandidate}>
                                <Eye className="size-4" />
                                Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleDuplicateTask}>
                                <Copy className="size-4" />
                                Duplicate Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onSelect={onDeleteClick}>
                                <Trash2 className="size-4" />
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </aside>
    );
}
