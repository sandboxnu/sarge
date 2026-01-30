'use client';

import { Search } from '@/lib/components/core/Search';
import { Button } from '@/lib/components/ui/Button';
import { DropdownMenu } from '@/lib/components/ui/Dropdown';
import { Tabs, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { ArrowDownUp, Plus, SlidersHorizontal } from 'lucide-react';
import { useTaskTemplateList } from '@/lib/hooks/useTaskList';
import TaskCard from '@/lib/components/core/TaskCard';
import type { TaskTemplateWithTagsDTO } from '@/lib/schemas/task-template.schema';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Pager from '@/lib/components/ui/Pager';

export default function TemplatesPage() {
    const { taskTemplateList, isLoading, error, limit, page, setLimit, setPage } =
        useTaskTemplateList();

    return (
        <div className="flex h-full flex-col">
            <div className="flex flex-col gap-3 border-b-1 px-5 pt-4">
                <h1 className="text-xl font-bold">Templates</h1>
                <div className="flex flex-row items-center justify-between">
                    <div className="items-center">
                        <Tabs defaultValue="tasks">
                            <TabsList className="h-auto gap-5 bg-transparent p-0">
                                <UnderlineTabsTrigger value="tasks">
                                    Tasks ({taskTemplateList?.length ?? 0})
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
            <div className="flex h-full flex-row">
                <div className="border-sarge-gray-200 flex flex-col gap-2.5 border-r-1">
                    <div className="flex items-center gap-2.5 px-3 pt-3">
                        <Search className="border-none" />
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
                    <div className="flex h-full w-full flex-col gap-2.5 overflow-scroll px-3">
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
                        {taskTemplateList && taskTemplateList.length === 0 && (
                            <div className="text-sarge-gray-300 flex h-full w-full flex-col items-center justify-center">
                                <Image
                                    src={'../Winston Logomark.svg'}
                                    height={200}
                                    width={200}
                                    alt={'Winston Logo'}
                                />
                                You currently have no tasks
                            </div>
                        )}
                        {/* eslint-disable-next-line @typescript-eslint/prefer-optional-chain */}
                        {taskTemplateList &&
                            taskTemplateList.map((task: TaskTemplateWithTagsDTO, idx: number) => {
                                return (
                                    <TaskCard
                                        key={idx}
                                        title={task.title}
                                        subtitle={'subtitle'}
                                        chips={task.tags ?? []}
                                        selected={false}
                                    />
                                );
                            })}
                    </div>
                    <div className="border-sarge-gray-200 flex flex-col gap-2.5 border-t-1 p-3">
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
                                total={limit}
                                changePage={setPage}
                                changeLimit={setLimit}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-start gap-3.5 p-7.5"></div>
            </div>
        </div>
    );
}
