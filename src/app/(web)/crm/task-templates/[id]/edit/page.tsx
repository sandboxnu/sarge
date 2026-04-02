'use client';

import Image from 'next/image';
import { use } from 'react';
import useTaskTemplateEditPage from '@/lib/hooks/useTaskTemplateEditPage';
import { Editor } from '@monaco-editor/react';
import CodeEditorToolbar from '@/lib/components/core/CodeEditorToolbar';
import TestCaseEditor from '@/lib/components/core/TestCaseEditor';
import { Button } from '@/lib/components/ui/Button';
import TaskEditorSidebar from '@/lib/components/core/TaskEditorSidebar';
import Breadcrumbs from '@/lib/components/core/Breadcrumbs';
import useTestRunner from '@/lib/hooks/useTestRunner';

export default function TaskTemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
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
        timeout,
        setTimeout,
        estimatedTime,
        setEstimatedTime,
        isLoading,
        selectedLanguage,
        activeFileTab,
        handleEditorContent,
        handleLanguageChange,
        handleTaskSolutionToggle,
        isSaving,
        saveTaskTemplate,
        removeLanguage,
        clearAllLanguages,
        handleLanguageSelectionChange,
        generateStubsForLanguages,
        getEditorContent,
    } = useTaskTemplateEditPage(id);
    const { runEditPageTests } = useTestRunner(
        getEditorContent(),
        languages ? languages[selectedLanguage].language : 'python' // UHHHH
    );

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
            <div className="border-sarge-gray-200 flex items-center justify-between border-b px-5 py-4">
                <Breadcrumbs
                    segments={[{ label: 'Task Templates', href: '/crm/templates' }]}
                    currentPage={title}
                    editable
                    onCurrentPageChange={setTitle}
                />
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
                        description={description}
                        setDescription={setDescription}
                        tags={tags}
                        setTags={setTags}
                        availableTags={availableTags}
                        setAvailableTags={setAvailableTags}
                        languages={languages}
                        timeout={timeout}
                        setTimeout={setTimeout}
                        estimatedTime={estimatedTime}
                        setEstimatedTime={setEstimatedTime}
                        isSaving={isSaving}
                        removeLanguage={removeLanguage}
                        clearAllLanguages={clearAllLanguages}
                        handleLanguageSelectionChange={handleLanguageSelectionChange}
                        generateStubsForLanguages={generateStubsForLanguages}
                    />
                </div>

                <div className="bg-sarge-gray-700 flex w-2/3 flex-col">
                    <div className="flex h-1/2 flex-col">
                        <CodeEditorToolbar
                            activeTab={activeFileTab}
                            onTabChange={handleTaskSolutionToggle}
                            languages={languages ?? []}
                            selectedLanguageIndex={selectedLanguage}
                            handleLanguageChange={handleLanguageChange}
                        />
                        <div className="min-h-0 flex-1 p-2">
                            <Editor
                                className="h-full"
                                defaultLanguage={
                                    selectedLanguage >= 0 &&
                                    taskTemplate?.languages[selectedLanguage]
                                        ? taskTemplate.languages[selectedLanguage].language
                                        : 'plaintext'
                                }
                                defaultValue={
                                    selectedLanguage >= 0 &&
                                    taskTemplate?.languages[selectedLanguage]
                                        ? taskTemplate.languages[selectedLanguage].stub
                                        : ''
                                }
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
                            runTests={runEditPageTests}
                            isSaving={isSaving}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
