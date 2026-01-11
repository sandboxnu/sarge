'use client';

import { Editor } from '@monaco-editor/react';
import BlockNoteViewer from '@/lib/components/core/BlockNoteViewer';
import TaskTemplateEditorHeader from '@/lib/components/core/TaskTemplateEditorHeader';
import CodeEditorToolbar from '@/lib/components/core/CodeEditorToolbar';
import TestCaseManager from '@/lib/components/core/TestCaseManager';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/lib/components/ui/Resizable';
import { useTaskTemplateEditor } from '@/lib/hooks/useTaskTemplateEditor';
import type { TaskTemplateDetail } from '@/lib/types/task-template.types';

interface TaskTemplateEditorProps {
    initialTemplate: TaskTemplateDetail;
}

export default function TaskTemplateEditor({ initialTemplate }: TaskTemplateEditorProps) {
    const {
        title,
        setTitle,
        description,
        setDescription,
        testCases,
        currentLanguage,
        selectedTestCaseId,
        hasUnsavedChanges,
        isSaving,
        testOutput,
        isRunning,
        handleAddTestCase,
        handleDeleteTestCase,
        handleUpdateTestCase,
        handleToggleTestCaseVisibility,
        handleSelectTestCase,
        handleEditorMount,
        handleLanguageChange,
        handleRunCode,
        handleSave,
        handleCancel,
        availableLanguages,
    } = useTaskTemplateEditor(initialTemplate);

    return (
        <div className="flex h-screen flex-col">
            <TaskTemplateEditorHeader
                title={title}
                onTitleChange={setTitle}
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
            />

            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={35} minSize={20} maxSize={50}>
                    <div className="flex h-full flex-col">
                        <div className="border-b border-sarge-gray-200 bg-sarge-gray-50 px-4 py-3">
                            <h2 className="text-label-s font-semibold text-sarge-gray-800">
                                Task Description
                            </h2>
                        </div>
                        <BlockNoteViewer
                            content={description}
                            onChange={setDescription}
                            editable={true}
                            className="flex-1 overflow-auto p-4"
                        />
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={65} minSize={30}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={55} minSize={30}>
                            <div className="flex h-full flex-col">
                                <CodeEditorToolbar
                                    language={currentLanguage}
                                    availableLanguages={availableLanguages}
                                    onLanguageChange={handleLanguageChange}
                                    onRunCode={handleRunCode}
                                    isRunning={isRunning}
                                />
                                <Editor
                                    height="100%"
                                    defaultLanguage={currentLanguage}
                                    defaultValue=""
                                    onMount={handleEditorMount}
                                    theme="vs-light"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                    }}
                                />
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        <ResizablePanel defaultSize={45} minSize={20}>
                            <TestCaseManager
                                testCases={testCases}
                                selectedTestCaseId={selectedTestCaseId}
                                onSelectTestCase={handleSelectTestCase}
                                onAdd={handleAddTestCase}
                                onDelete={handleDeleteTestCase}
                                onUpdate={handleUpdateTestCase}
                                onToggleVisibility={handleToggleTestCaseVisibility}
                                testOutput={testOutput}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
