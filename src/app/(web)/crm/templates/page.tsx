'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from '@/lib/components/core/Search';
import { Button } from '@/lib/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { ArrowDownUp, Plus, SlidersHorizontal } from 'lucide-react';
import { useTaskTemplateList } from '@/lib/hooks/useTaskTemplateList';
import TaskCard from '@/lib/components/core/TaskCard';
import { TaskTemplatePreviewPanel } from '@/lib/components/core/TaskTemplatePreviewPanel';
import type { TaskTemplateListItemDTO } from '@/lib/schemas/task-template.schema';
import Image from 'next/image';
import Pager from '@/lib/components/ui/Pager';
import GreyWinstonLogoMark from '@/../public/GreyWinstonLogoMark.svg';
import useSearch from '@/lib/hooks/useSearch';
import { useAssessmentTemplateList } from '@/lib/hooks/useAssessmentTemplateList';
import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';
import AssessmentCard from '@/lib/components/core/AssessmentCard';
import {
    deleteTaskTemplate,
    duplicateTaskTemplate,
    getDuplicateTitle,
} from '@/lib/api/task-templates';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/lib/components/ui/Modal';
import { createTaskTemplate } from '@/lib/api/task-templates';
import { createDuplicateTitle } from '@/lib/utils/template.utils';
import { useAuth } from '@/lib/auth/auth-context';

export default function TemplatesPage() {
    const [selectedTaskTemplate, setSelectedTaskTemplate] =
        useState<TaskTemplateListItemDTO | null>(null);
    const [selectedAssessmentTemplate, setSelectedAssessmentTemplate] =
        useState<AssessmentTemplateListItemDTO | null>(null);
    const [isMutating, setIsMutating] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
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
        insertTaskTemplateAtTopOfPage,
        updatePageTemplates,
    } = useTaskTemplateList();

    const assessmentTemplateList = useAssessmentTemplateList();

    const taskTemplateSearch = useSearch('task-templates');
    const assessmentTemplateSearch = useSearch('assessment-templates');

    const [activeTab, setActiveTab] = useState<'tasks' | 'assessments'>('tasks');

    const isSearchingForTaskTemplate = taskTemplateSearch.value.trim().length >= 1;
    const isSearchingForAssessmentTemplate = assessmentTemplateSearch.value.trim().length >= 1;

    const { activeOrganizationId } = useAuth();

    const onDuplicate = async (taskTemplateId: string) => {
        try {
            setIsMutating(true);
            const duplicatedTemplate = await duplicateTaskTemplate(taskTemplateId);
            insertTaskTemplateAtTopOfPage(duplicatedTemplate);
            setSelectedTaskTemplate(duplicatedTemplate);
        } catch {
        } finally {
            setIsMutating(false);
        }
    };

    const onDelete = (taskTemplateId: string) => {
        setPendingDeleteId(taskTemplateId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) {
            return;
        }

        try {
            setIsMutating(true);
            await deleteTaskTemplate(pendingDeleteId);
            await updatePageTemplates();

            setSelectedTaskTemplate((prev) => (prev?.id === pendingDeleteId ? null : prev));
            setDeleteDialogOpen(false);
            setPendingDeleteId(null);
        } catch {
        } finally {
            setIsMutating(false);
        }
    };

    const handleCreateTask = async () => {
        if (isCreating || !activeOrganizationId) return;
        setIsCreating(true);

        const { data: title } = await getDuplicateTitle('Unnamed Task Template');
        try {
            const created = await createTaskTemplate({
                title,
                description: [],
                publicTestCases: [],
                privateTestCases: [],
                taskType: null,
            });
            router.push(`/crm/task-templates/${created.id}/edit`);
        } catch (err) {
            console.error('Failed to create task template:', err);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Tabs
            defaultValue="tasks"
            className="flex h-full flex-col"
            onValueChange={(v) => setActiveTab(v as 'tasks' | 'assessments')}
        >
            <div className="flex flex-col gap-3 border-b-1 px-5 pt-4">
                <h1 className="text-xl font-bold">Templates</h1>
                <div className="flex flex-row items-center justify-between">
                    <TabsList className="h-auto gap-5 rounded-none bg-transparent p-0">
                        <UnderlineTabsTrigger value="tasks">
                            Tasks ({total ?? 0})
                        </UnderlineTabsTrigger>
                        <UnderlineTabsTrigger value="assessments">
                            Assessments ({assessmentTemplateList.total ?? 0})
                        </UnderlineTabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-4">
                        {activeTab === 'tasks' ? (
                            <Button
                                className="px-4 py-2"
                                onClick={handleCreateTask}
                                disabled={isCreating}
                            >
                                <Plus /> New Task
                            </Button>
                        ) : (
                            <Button className="px-4 py-2">
                                <Plus /> New Assessment
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-row">
                <TabsContent
                    value="tasks"
                    className="border-sarge-gray-200 flex min-h-0 w-1/4 shrink-0 flex-col border-r-1"
                >
                    <div className="flex items-center gap-2.5 px-3 pt-3">
                        <Search
                            className="border-none"
                            value={taskTemplateSearch.value}
                            onChange={taskTemplateSearch.onChange}
                            placeholder="Type to search"
                        />
                        <div className="flex">
                            <Button variant="icon" className="px-3 py-2">
                                <SlidersHorizontal className="size-5" />
                            </Button>
                            <Button variant="icon" className="px-3 py-2">
                                <ArrowDownUp className="size-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-scroll px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {isLoading || taskTemplateSearch.loading ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image
                                    src="/CreateOrgLoading.gif"
                                    alt="Loading GIF"
                                    width={66}
                                    height={66}
                                />
                            </div>
                        ) : error ? (
                            <div>Error: {error.message}</div>
                        ) : (isSearchingForTaskTemplate
                              ? taskTemplateSearch.data
                              : taskTemplateList
                          ).length === 0 ? (
                            <div className="text-sarge-gray-500 flex h-full w-full flex-col items-center justify-center gap-4">
                                <Image
                                    src={GreyWinstonLogoMark}
                                    height={78}
                                    width={140}
                                    alt="Winston Logo"
                                />
                                {isSearchingForTaskTemplate
                                    ? 'Could not find task'
                                    : 'You currently have no tasks'}
                            </div>
                        ) : (
                            (isSearchingForTaskTemplate
                                ? taskTemplateSearch.data
                                : taskTemplateList
                            ).map((task: TaskTemplateListItemDTO, idx: number) => {
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
                </TabsContent>

                <TabsContent
                    value="assessments"
                    className="border-sarge-gray-200 flex min-h-0 w-1/4 shrink-0 flex-col border-r-1"
                >
                    <div className="flex items-center gap-2.5 px-3 pt-3">
                        <Search
                            className="border-none"
                            value={assessmentTemplateSearch.value}
                            onChange={assessmentTemplateSearch.onChange}
                            placeholder="Type to search"
                        />
                        <div className="flex">
                            <Button variant="icon" className="px-3 py-2">
                                <SlidersHorizontal className="size-5" />
                            </Button>
                            <Button variant="icon" className="px-3 py-2">
                                <ArrowDownUp className="size-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-scroll px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {assessmentTemplateList.isLoading || assessmentTemplateSearch.loading ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <Image
                                    src="/CreateOrgLoading.gif"
                                    alt="Loading GIF"
                                    width={66}
                                    height={66}
                                />
                            </div>
                        ) : assessmentTemplateList.error ? (
                            <div>Error: {assessmentTemplateList.error.message}</div>
                        ) : (isSearchingForAssessmentTemplate
                              ? assessmentTemplateSearch.data
                              : assessmentTemplateList.assessmentTemplateList
                          ).length === 0 ? (
                            <div className="text-sarge-gray-500 flex h-full w-full flex-col items-center justify-center gap-4">
                                <Image
                                    src={GreyWinstonLogoMark}
                                    height={78}
                                    width={140}
                                    alt="Winston Logo"
                                />
                                {isSearchingForAssessmentTemplate
                                    ? 'Could not find assessment'
                                    : 'You currently have no assessments'}
                            </div>
                        ) : (
                            (isSearchingForAssessmentTemplate
                                ? assessmentTemplateSearch.data
                                : assessmentTemplateList.assessmentTemplateList
                            ).map((assessment: AssessmentTemplateListItemDTO) => (
                                <AssessmentCard
                                    key={assessment.id}
                                    template={assessment}
                                    isSelected={selectedAssessmentTemplate?.id === assessment.id}
                                    onClick={() => setSelectedAssessmentTemplate(assessment)}
                                />
                            ))
                        )}
                    </div>
                    <div className="border-sarge-gray-200 flex flex-col gap-2.5 border-t-1 p-3">
                        <div className="flex-1 justify-end">
                            <Pager
                                page={assessmentTemplateList.page}
                                limit={assessmentTemplateList.limit}
                                total={assessmentTemplateList.total}
                                changePage={assessmentTemplateList.setPage}
                                changeLimit={assessmentTemplateList.setLimit}
                            />
                        </div>
                    </div>
                </TabsContent>

                <div className="flex w-3/4 flex-col overflow-y-scroll p-[30px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {selectedTaskTemplate ? (
                        <TaskTemplatePreviewPanel
                            taskTemplatePreview={selectedTaskTemplate}
                            onDuplicate={isMutating ? undefined : onDuplicate}
                            onDelete={isMutating ? undefined : onDelete}
                        />
                    ) : selectedAssessmentTemplate ? (
                        <div className="flex h-full items-center justify-center">
                            {/* ASSESSMENT TEMPLATE PREVIEW COMPONENT GOES HERE */}
                        </div>
                    ) : (
                        <div className="text-body-m text-muted-foreground flex h-full items-center justify-center">
                            Select a template to preview
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md gap-4 p-6" showCloseButton={!isMutating}>
                    <DialogHeader>
                        <DialogTitle>Delete task template?</DialogTitle>
                        <DialogDescription>This action can&apos;t be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex w-full flex-row justify-between">
                        <Button
                            className="hover:bg-sarge-gray-100 text-sarge-gray-700 bg-white px-4 py-2"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setPendingDeleteId(null);
                            }}
                            disabled={isMutating}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-sarge-error-400 hover:bg-sarge-error-700 text-sarge-gray-50 px-4 py-2"
                            onClick={confirmDelete}
                            disabled={isMutating}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Tabs>
    );
}
