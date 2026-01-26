'use client';

import type { TaskEditorSectionId } from '@/lib/constants/task-editor.constants';
import { useTaskEditorActions } from '@/lib/hooks/useTaskEditorActions';
import { DeleteTaskModal } from '@/lib/components/modal/DeleteTaskModal';
import { TaskEditorSidebar } from '@/lib/components/core/task-editor/TaskEditorSidebar';

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
                <TaskEditorSidebar
                    currentSection={currentSection}
                    onSectionChange={onSectionChange}
                    onSave={onSave}
                    isSaving={isSaving}
                    handlePreviewAsCandidate={handlePreviewAsCandidate}
                    handleDuplicateTask={handleDuplicateTask}
                    handleNavigateToTaskLibrary={handleNavigateToTaskLibrary}
                    onDeleteClick={() => setIsDeleteModalOpen(true)}
                />

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
