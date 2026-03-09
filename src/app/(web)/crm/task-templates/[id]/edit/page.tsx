'use client';

import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import useTaskTemplateEditPage from '@/lib/hooks/useTaskTemplateEditPage';
import { Editor } from '@monaco-editor/react';
import CodeEditorToolbar from '@/lib/components/core/CodeEditorToolbar';
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
        setLanguages,
        isLoading,
        selectedLanguage,
        activeFileTab,
        handleEditorContent,
        handleLanguageChange,
        handleTaskSolutionToggle,
        isSaving,
        saveTaskTemplate,
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
                    <Button
                        variant="icon"
                        onClick={() => router.push('/crm/templates')}
                        disabled={isSaving}
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
                <Button
                    variant="secondary"
                    className="px-4 py-2"
                    onClick={saveTaskTemplate}
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
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
                        setLanguages={setLanguages}
                        isSaving={isSaving}
                    />
                </div>

                <div className="bg-sarge-gray-700 flex w-2/3 flex-col">
                    <div className="flex h-1/2 flex-col">
                        <CodeEditorToolbar
                            activeTab={activeFileTab}
                            onTabChange={handleTaskSolutionToggle}
                            languages={taskTemplate?.languages ?? []}
                            selectedLanguageIndex={selectedLanguage}
                            onLanguageChange={handleLanguageChange}
                        />
                        <div className="min-h-0 flex-1 p-2">
                            <Editor
                                className="h-full"
                                defaultLanguage={
                                    taskTemplate?.languages[selectedLanguage]?.language
                                }
                                defaultValue={taskTemplate?.languages[selectedLanguage]?.stub}
                                onMount={handleEditorContent}
                                options={{ readOnly: isSaving }}
                            />
                        </div>
                    </div>

                    <div className="bg-background flex h-1/2 flex-col overflow-hidden">
                        <TestCaseEditor
                            publicTestCases={publicTestCases}
                            setPublicTestCases={setPublicTestCases}
                            privateTestCases={privateTestCases}
                            setPrivateTestCases={setPrivateTestCases}
                            isSaving={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
