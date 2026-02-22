'use client';

import Image from 'next/image';
import { ChevronDown, ChevronLeft, EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import useTaskTemplateEditPage from '@/lib/hooks/useTaskTemplateEditPage';
import { Editor } from '@monaco-editor/react';
import { Tabs, TabsList, TabsTrigger } from '@/lib/components/ui/Tabs';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/lib/components/ui/Dropdown';
import TestCaseEditor from '@/lib/components/core/TestCaseEditor';
import { Button } from '@/lib/components/ui/Button';
import TaskEditorSidebar from '@/lib/components/core/TaskEditorSidebar';

export default function TaskTemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const {
        taskTemplate,
        title,
        publicTestCases,
        setPublicTestCases,
        privateTestCases,
        setPrivateTestCases,
        setTitle,
        description,
        setDescription,
        tags,
        setTags,
        availableTags,
        setAvailableTags,
        languages,
        isLoading,
        selectedLanguage,
        handleEditorContent,
        handleLanguageChange,
        handleTaskSolutionToggle,
        removeLanguage,
        clearAllLanguages,
        handleLanguageSelectionChange,
    } = useTaskTemplateEditPage(id);

    if (isLoading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                <Image src="/CreateOrgLoading.gif" alt="Loading GIF" width={66} height={66} />
                <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide">
                    Opening task template editor...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
                <div className="flex items-center gap-2">
                    <Button variant="icon" onClick={() => router.push('/crm/templates')}>
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
                <Button variant="secondary" className="px-4 py-2">
                    Save Changes
                </Button>
            </div>

            <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="h-full min-h-0 w-1/3 min-w-0">
                    <TaskEditorSidebar
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        tags={tags}
                        setTags={setTags}
                        availableTags={availableTags}
                        setAvailableTags={setAvailableTags}
                        languages={languages}
                        removeLanguage={removeLanguage}
                        clearAllLanguages={clearAllLanguages}
                        handleLanguageSelectionChange={handleLanguageSelectionChange}
                    />
                </div>

                <div className="flex w-2/3 flex-col bg-[#384150]">
                    <div className="flex h-1/2 flex-col">
                        <div className="border-b-sarge-gray-600 flex w-full justify-between border-b-1 text-white">
                            <Tabs defaultValue="task" onValueChange={handleTaskSolutionToggle}>
                                <TabsList className="h-auto bg-transparent p-0">
                                    <TabsTrigger
                                        value="task"
                                        className="data-[state=active]:!border-sarge-gray-600 relative h-full rounded-none !border-0 px-2.5 !text-white data-[state=active]:!border-x-1 data-[state=active]:!border-y-0 data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:after:absolute data-[state=active]:after:right-0 data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:h-[1px] data-[state=active]:after:bg-[#384150] data-[state=active]:after:content-['']"
                                    >
                                        Main
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="solution"
                                        className="data-[state=active]:!border-sarge-gray-600 relative h-full rounded-none !border-0 px-2.5 !text-white data-[state=active]:!border-x-1 data-[state=active]:!border-y-0 data-[state=active]:!bg-transparent data-[state=active]:!shadow-none data-[state=active]:after:absolute data-[state=active]:after:right-0 data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:h-[1px] data-[state=active]:after:bg-[#384150] data-[state=active]:after:content-['']"
                                    >
                                        Solution
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="text-md flex items-center gap-1.5">
                                <div>Language</div>
                                {languages && languages.length > 0 && selectedLanguage >= 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="bg-sarge-primary-500 flex items-center gap-2.5 rounded-sm px-2.5 text-white hover:cursor-pointer">
                                                {languages[selectedLanguage]?.language}
                                                <ChevronDown className="size-4" />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side="bottom"
                                            align="center"
                                            className="bg-sarge-primary-500 rounded-sm px-2.5"
                                        >
                                            <DropdownMenuGroup className="p-0 !text-white">
                                                {languages
                                                    .filter((l) => l !== languages[selectedLanguage])
                                                    .map((l) => (
                                                        <DropdownMenuItem
                                                            className="!hover:text-sarge-primary-500 hover:!bg-sarge-primary-600 border-none !text-white hover:cursor-pointer"
                                                            key={l.language}
                                                            onClick={() => handleLanguageChange(l)}
                                                        >
                                                            {l.language}
                                                        </DropdownMenuItem>
                                                    ))}
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                <EllipsisVertical className="mr-2.5 size-5" />
                            </div>
                        </div>
                        <div className="min-h-0 flex-1 p-2">
                            <Editor
                                className="h-full"
                                defaultLanguage={
                                    selectedLanguage >= 0 && taskTemplate?.languages[selectedLanguage]
                                        ? taskTemplate.languages[selectedLanguage].language
                                        : 'plaintext'
                                }
                                defaultValue={
                                    selectedLanguage >= 0 && taskTemplate?.languages[selectedLanguage]
                                        ? taskTemplate.languages[selectedLanguage].stub
                                        : ''
                                }
                                onMount={handleEditorContent}
                            />
                        </div>
                    </div>

                    <div className="flex h-1/2 flex-col overflow-hidden bg-white">
                        <TestCaseEditor
                            publicTestCases={publicTestCases}
                            setPublicTestCases={setPublicTestCases}
                            privateTestCases={privateTestCases}
                            setPrivateTestCases={setPrivateTestCases}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
