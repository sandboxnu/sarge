'use client';

import { useCallback, useState } from 'react';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Search } from '@/lib/components/core/Search';
import TaskCard from '@/lib/components/core/TaskCard';
import Pager from '@/lib/components/ui/Pager';

import { useAddTaskModal } from '@/lib/hooks/useAddTaskModal';
import GreyWinstonLogoMark from '@/../public/GreyWinstonLogoMark.svg';

type AddTaskModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (taskTemplateIds: string[]) => void;
    alreadyAddedIds?: Set<string>;
};

export default function AddTaskModal({
    open,
    onOpenChange,
    onAdd,
    alreadyAddedIds = new Set(),
}: AddTaskModalProps) {
    const {
        displayList,
        displayTotal,
        isLoading,
        error,
        page,
        setPage,
        limit,
        searchQuery,
        handleSearchChange,
        isSearching,
    } = useAddTaskModal(open);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setSelectedIds(new Set());
        }
        onOpenChange(nextOpen);
    };

    const toggleSelection = useCallback(
        (taskTemplateId: string) => {
            if (alreadyAddedIds.has(taskTemplateId)) return;

            setSelectedIds((prev) => {
                const next = new Set(prev);
                if (next.has(taskTemplateId)) {
                    next.delete(taskTemplateId);
                } else {
                    next.add(taskTemplateId);
                }
                return next;
            });
        },
        [alreadyAddedIds]
    );

    const handleAdd = () => {
        onAdd(Array.from(selectedIds));
        handleOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="flex w-[960px] !max-w-[90vw] flex-col gap-0 p-0"
                showCloseButton={true}
            >
                <div className="px-7 pt-6 pb-0">
                    <DialogTitle className="text-display-xs">Add a task</DialogTitle>
                </div>

                <div className="flex items-center gap-4 px-7 pt-4">
                    <Search
                        placeholder="Search for a task template"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <div className="flex items-center gap-3">
                        <Button variant="dropdown">
                            <ArrowDownUp className="size-5" />
                            <span className="text-label-s">Sort</span>
                        </Button>

                        <Button variant="dropdown">
                            <SlidersHorizontal className="size-5" />
                            <span className="text-label-s">Filter</span>
                        </Button>
                    </div>
                </div>

                <div className="mx-7 mt-4 flex h-[460px] flex-col">
                    {isLoading ? (
                        <div className="flex flex-1 items-center justify-center">
                            <Image
                                src="/CreateOrgLoading.gif"
                                alt="Loading"
                                width={66}
                                height={66}
                            />
                        </div>
                    ) : error ? (
                        <div className="text-sarge-error-700 flex flex-1 items-center justify-center p-6">
                            Error loading task templates
                        </div>
                    ) : displayList.length === 0 ? (
                        <div className="text-sarge-gray-500 flex flex-1 flex-col items-center justify-center gap-4">
                            <Image
                                src={GreyWinstonLogoMark}
                                height={78}
                                width={140}
                                alt="Winston Logo"
                            />
                            {isSearching
                                ? 'No task templates found'
                                : 'You currently have no task templates'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {displayList.map((task, idx) => {
                                const isAlreadyAdded = alreadyAddedIds.has(task.id);

                                return isAlreadyAdded ? (
                                    <div key={task.id} className="relative">
                                        <div className="pointer-events-none opacity-50">
                                            <TaskCard
                                                title={task.title}
                                                subtitle={task.taskType ?? ''}
                                                chips={task.tags ?? []}
                                                languages={task.languages}
                                                isSelected={true}
                                                setIsSelected={() => {}}
                                                index={idx}
                                                taskTemplateId={task.id}
                                                maxTags={2}
                                            />
                                        </div>
                                        <span className="text-label-xs text-sarge-gray-500 absolute right-3 bottom-3">
                                            Already added
                                        </span>
                                    </div>
                                ) : (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        subtitle={task.taskType ?? ''}
                                        chips={task.tags ?? []}
                                        languages={task.languages}
                                        isSelected={selectedIds.has(task.id)}
                                        setIsSelected={() => toggleSelection(task.id)}
                                        index={idx}
                                        taskTemplateId={task.id}
                                        isPreviewSelected={selectedIds.has(task.id)}
                                        onPreviewSelect={() => toggleSelection(task.id)}
                                        maxTags={2}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-center px-7 pt-3">
                    <Pager
                        page={page}
                        limit={limit}
                        total={displayTotal}
                        changePage={setPage}
                        changeLimit={() => {}}
                        limitOptions={[9]}
                    />
                </div>

                <div className="flex items-center justify-between px-7 pt-3 pb-6">
                    <Button type="button" variant="link" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className="px-8 py-2"
                        onClick={handleAdd}
                        disabled={selectedIds.size === 0}
                    >
                        Add
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
