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
import { TASK_EDITOR_SECTIONS, type TaskEditorSectionId } from '@/lib/constants/task-editor.constants';
import { cn } from '@/lib/utils/cn.utils';
import { useTaskEditorActions } from '@/lib/hooks/useTaskEditorActions';
import { DeleteTaskModal } from '@/lib/components/modal/DeleteTaskModal';

interface TaskEditorShellProps {
    taskName: string;
    currentSection: TaskEditorSectionId;
    onSectionChange: (id: TaskEditorSectionId) => void;
    onSave: () => void;
    isSaving: boolean;
    onDelete?: () => Promise<void> | void;
    children: React.ReactNode;
}

export function TaskEditorShell({
    taskName,
    currentSection,
    onSectionChange,
    onSave,
    isSaving,
    onDelete,
    children,
}: TaskEditorShellProps) {
    const {
        handlePreviewAsCandidate,
        handleDuplicateTask,
        handleDeleteTask,
        handleNavigateToTaskLibrary,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    } = useTaskEditorActions({
        onDelete,
    });

    return (
        <article className="flex h-full flex-col overflow-hidden bg-card">
            <div className="flex flex-1 overflow-hidden">
                <aside className="flex w-52 flex-col border-r border-border bg-background">
                    <div className="px-2 pt-3 pb-2">
                        <Button
                            asChild
                            variant="link"
                            className="w-full justify-start text-label-xs"
                        >
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
                            >
                                Save
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
                                    <DropdownMenuItem
                                        variant="destructive"
                                        onSelect={() => setIsDeleteModalOpen(true)}
                                    >
                                        <Trash2 className="size-4" />
                                        Delete Task
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </aside>

                <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
                    {children}
                </main>
            </div>

            <DeleteTaskModal
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                taskName={taskName}
                onConfirm={handleDeleteTask}
            />
        </article>
    );
}
