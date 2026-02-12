'use client';

import { useState } from 'react';
import { Search } from '@/lib/components/core/Search';
import { Button } from '@/lib/components/ui/Button';
import { DropdownMenu } from '@/lib/components/ui/Dropdown';
import { Tabs, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { ArrowDownUp, Plus, SlidersHorizontal } from 'lucide-react';
import { useTaskTemplateList } from '@/lib/hooks/useTaskList';
import TaskCard from '@/lib/components/core/TaskCard';
import { TaskTemplatePreviewPanel } from '@/lib/components/core/TaskTemplatePreviewPanel';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Pager from '@/lib/components/ui/Pager';
import GreyWinstonLogoMark from '@/../public/GreyWinstonLogoMark.svg';
import useSearch from '@/lib/hooks/useSearch';

export default function TemplatesPage() {
    const [selectedTaskTemplate, setSelectedTaskTemplate] =
        useState<TaskTemplateListItemDTO | null>(null);
    const {
        taskTemplateList,
        isLoading,
        error,
        limit,
        page,
        setLimit,
        setPage,
        selected,
        handleSelectTask,
        total,
    } = useTaskTemplateList();

    const { value, onChange, data, loading } = useSearch('task-templates');

    const isSearching = value.trim().length >= 1;

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-col gap-3 border-b-1 px-5 pt-4">
                <h1 className="text-xl font-bold">Templates</h1>
                <div className="flex flex-row items-center justify-between">
                    <div className="items-center">
                        <Tabs defaultValue="tasks">
                            <TabsList className="h-auto gap-5 bg-transparent p-0">
                                <UnderlineTabsTrigger value="tasks">
                                    Tasks ({total ?? 0})
                                </UnderlineTabsTrigger>
                                <UnderlineTabsTrigger value="assessments">
                                    Assessments
                                </UnderlineTabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button className="px-4 py-2">
                            <Plus /> New Task
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-row">
                <div className="border-sarge-gray-200 flex w-96 flex-col gap-2.5 border-r-1">
                    <div className="flex items-center gap-2.5 px-3 pt-3">
                        <Search 
                        className="border-none" 
                        value={value}
                        onChange={onChange}
                        placeholder="Type to search" />
                        <div className="flex">
                            <Button
                                variant="secondary"
                                className="bg-sarge-gray-100 hover:bg-sarge-gray-200 border-none px-3 py-2"
                            >
                                <SlidersHorizontal className="!text-sarge-gray-600 !size-5" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="bg-sarge-gray-100 hover:bg-sarge-gray-200 border-none px-3 py-2"
                            >
                                <ArrowDownUp className="!text-sarge-gray-600 !size-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex min-h-0 w-full flex-1 flex-col gap-2.5 overflow-scroll px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {isLoading || loading? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image
                                    src="/CreateOrgLoading.gif"
                                    alt="Loading GIF"
                                    width={66}
                                    height={66}
                                />
                            </div>
                        ) : error ? (
                            <div className="">Error: {error.message}</div>
                        ) : (isSearching ? data : taskTemplateList).length === 0 ? (
                            <div className="text-sarge-gray-500 flex h-full w-full flex-col items-center justify-center gap-4">
                                <Image
                                    src={GreyWinstonLogoMark}
                                    height={78}
                                    width={140}
                                    alt={'Winston Logo'}
                                />
                                {isSearching ? "Could not find task" : "You currently have no tasks"}
                            </div>
                        ) : (
                            (isSearching ? data : taskTemplateList).map((task: TaskTemplateListItemDTO, idx: number) => {
                                const absoluteIdx = page * limit + idx;
                                return (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        subtitle={task.taskType ?? ''}
                                        chips={task.tags ?? []}
                                        selected={selected?.includes(absoluteIdx) ?? false}
                                        setSelected={handleSelectTask}
                                        index={idx}
                                        taskTemplateId={task.id}
                                        isPreviewSelected={selectedTaskTemplate?.id === task.id}
                                        onPreviewSelect={() => setSelectedTaskTemplate(task)}
                                    />
                                );
                            })
                        )}
                    </div>
                    <div className="border-sarge-gray-200 flex flex-col gap-2.5 border-t-1 p-3">
                        <div className="flex-1 justify-end">
                            <Pager
                                page={page}
                                limit={limit}
                                total={total}
                                changePage={setPage}
                                changeLimit={setLimit}
                            />
                        </div>
                        <div className="flex w-full items-center gap-2.5">
                            <div className="text-sarge-primary-500 hover:cursor-pointer">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-2.5">
                                            <div>{selected?.length ?? 0} selected</div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="top"
                                        align="start"
                                        className="bg-white"
                                    >
                                        <DropdownMenuGroup>
                                            {selected && selected.length > 0 ? (
                                                selected.map((absoluteIdx) => (
                                                    <DropdownMenuLabel key={absoluteIdx}>
                                                        {taskTemplateList?.[
                                                            absoluteIdx - page * limit
                                                        ]?.title ?? `Item ${absoluteIdx}`}
                                                    </DropdownMenuLabel>
                                                ))
                                            ) : (
                                                <DropdownMenuLabel>
                                                    No items selected
                                                </DropdownMenuLabel>
                                            )}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Button className="flex-1 px-4 py-2" variant="secondary">
                                Create Assessment
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden p-[30px]">
                    {!selectedTaskTemplate && (
                        <div className="text-body-m text-muted-foreground flex h-full items-center justify-center">
                            Select a task template to preview
                        </div>
                    )}
                    {selectedTaskTemplate && (
                        <TaskTemplatePreviewPanel taskTemplatePreview={selectedTaskTemplate} />
                    )}
                </div>
            </div>
        </div>
    );
}
