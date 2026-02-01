'use client';

import { useState } from 'react';
import { Search } from '@/lib/components/core/Search';
import { Button } from '@/lib/components/ui/Button';
import { DropdownMenu } from '@/lib/components/ui/Dropdown';
import { Tabs, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { ArrowDownUp, Plus, SlidersHorizontal } from 'lucide-react';
import { useTaskTemplateList, useTaskTemplatePreview } from '@/lib/hooks/useTaskList';
import TaskCard from '@/lib/components/core/TaskCard';
import { TaskTemplatePreviewPanel } from '@/lib/components/core/TaskTemplatePreviewPanel';
import type { TaskTemplateWithTagsDTO } from '@/lib/schemas/task-template.schema';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Pager from '@/lib/components/ui/Pager';
import GreyWinstonLogoMark from '@/../public/GreyWinstonLogoMark.svg';

export default function TemplatesPage() {
    const [selectedTaskTemplateId, setSelectedTaskTemplateId] = useState<string | null>(null);
    const {
        taskTemplates,
        total,
        isLoading,
        error,
        limit,
        page,
        setLimit,
        setPage,
        refetchTaskTemplates,
    } = useTaskTemplateList();
    const {
        taskTemplatePreview,
        isLoading: isPreviewLoading,
        error: previewLoadError,
    } = useTaskTemplatePreview(selectedTaskTemplateId);

    async function handleDuplicateTaskTemplate(taskTemplateId: string) {
        try {
            const response = await fetch(`/api/task-templates/${taskTemplateId}/duplicate`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Duplicate failed');
            const responseData = await response.json();
            refetchTaskTemplates();
            setSelectedTaskTemplateId(responseData.data?.id ?? null);
        } catch {}
    }

    async function handleDeleteTaskTemplate(taskTemplateId: string) {
        try {
            const response = await fetch(`/api/task-templates/${taskTemplateId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Delete failed');
            setSelectedTaskTemplateId(null);
            refetchTaskTemplates();
        } catch {}
    }

    return (
        <div className="flex h-full min-w-0 flex-1 flex-col">
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
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-row overflow-hidden">
                <div className="border-sarge-gray-200 flex w-[326px] shrink-0 flex-col gap-2.5 border-r-1">
                    <div className="flex items-center gap-2.5 px-3 pt-3">
                        <Search className="border-none" />
                        <div className="flex">
                            <Button variant="icon" className="px-3 py-2">
                                <SlidersHorizontal className="size-5" />
                            </Button>
                            <Button variant="icon" className="px-3 py-2">
                                <ArrowDownUp className="size-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5 overflow-x-hidden overflow-y-auto border-0 px-3">
                        {isLoading && (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image
                                    src="/CreateOrgLoading.gif"
                                    alt="Loading GIF"
                                    width={66}
                                    height={66}
                                />
                            </div>
                        )}
                        {error && <div className="">Error</div>}
                        {taskTemplates && taskTemplates.length === 0 && (
                            <div className="text-sarge-gray-500 flex h-full w-full flex-col items-center justify-center gap-4">
                                <Image
                                    src={GreyWinstonLogoMark}
                                    height={78}
                                    width={140}
                                    alt={'Winston Logo'}
                                />
                                You currently have no tasks
                            </div>
                        )}
                        {taskTemplates?.map((taskTemplate: TaskTemplateWithTagsDTO) => (
                            <div
                                key={taskTemplate.id}
                                className="min-h-[88px] min-w-0 [&>button]:h-full [&>button]:min-h-0 [&>button]:w-full [&>button]:min-w-0"
                            >
                                <TaskCard
                                    taskTemplateId={taskTemplate.id}
                                    title={taskTemplate.title}
                                    subtitle="subtitle"
                                    tags={taskTemplate.tags ?? []}
                                    isSelected={selectedTaskTemplateId === taskTemplate.id}
                                    onSelect={() => setSelectedTaskTemplateId(taskTemplate.id)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2.5 p-3">
                        <div className="flex w-full items-center gap-2.5">
                            <div className="text-sarge-primary-500 hover:cursor-pointer">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-2.5">
                                            <div>0 selected</div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Option 1</DropdownMenuLabel>
                                            <DropdownMenuLabel>Option 2</DropdownMenuLabel>
                                            <DropdownMenuLabel>Option 3</DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Button className="flex-1 px-4 py-2" variant="secondary">
                                Create Assessment
                            </Button>
                        </div>
                        <div className="flex justify-end">
                            <Pager
                                page={page}
                                limit={limit}
                                total={total ?? 0}
                                changePage={setPage}
                                changeLimit={setLimit}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden p-[30px]">
                    {!selectedTaskTemplateId && (
                        <div className="text-body-m text-sarge-gray-500 flex h-full items-center justify-center">
                            Select a task template to preview
                        </div>
                    )}
                    {selectedTaskTemplateId && isPreviewLoading && (
                        <div className="flex h-full items-center justify-center">
                            <Image
                                src="/CreateOrgLoading.gif"
                                alt="Loading preview"
                                width={66}
                                height={66}
                            />
                        </div>
                    )}
                    {selectedTaskTemplateId && previewLoadError && (
                        <div className="text-body-m text-sarge-error-700 flex h-full items-center justify-center">
                            Failed to load preview
                        </div>
                    )}
                    {selectedTaskTemplateId && taskTemplatePreview && !isPreviewLoading && (
                        <TaskTemplatePreviewPanel
                            taskTemplatePreview={taskTemplatePreview}
                            onDuplicate={handleDuplicateTaskTemplate}
                            onDelete={handleDeleteTaskTemplate}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
