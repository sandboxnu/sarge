'use client';

import { Editor } from '@monaco-editor/react';
import { use } from 'react';
import { Button } from '@/lib/components/ui/Button';
import { useTask } from '@/lib/hooks/useTask';
import {
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle,
} from '@/lib/components/ui/Resizable';
import {
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/lib/components/ui/Dropdown';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import MarkdownViewer from '@/lib/components/core/Markdown';
import useAssessment from '@/lib/hooks/useAssessment';

export default function TaskPage({
    params,
}: {
    params: Promise<{ taskId: string; assessmentId: string }>;
}) {
    const { taskId, assessmentId } = use(params);
    const {
        taskTemplate,
        isLoading,
        error,
        language,
        output,
        handleEditorContent,
        handleLanguageChange,
        handleRunButton,
        handleSubmitButton,
        languageIds,
    } = useTask(taskId, assessmentId);
    const { goToNextTask } = useAssessment(assessmentId, taskId);

    if (isLoading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    if (error || !taskTemplate) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                Error: {error?.message ?? 'Task not found'}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="min-h-screen">
                <ResizablePanel defaultSize={20} minSize={20}>
                    <div className="flex h-full max-h-screen flex-col overflow-y-auto border-1 p-4">
                        {/*
                          TODO: Update this to use BlockNoteViewer instead of MarkdownViewer.
                          The `description` field is now a BlockNote JSON array (not a string).
                          See: src/lib/components/core/BlockNoteViewer.tsx
                        */}
                        <MarkdownViewer content={'Loading problem...'} />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={80} minSize={20}>
                    <ResizablePanelGroup direction="vertical" className="min-h-screen">
                        <ResizablePanel defaultSize={70} minSize={20}>
                            <div className="w-full items-center border-b border-sarge-gray-200 bg-sarge-gray-50 p-3">
                                <div className="flex justify-between">
                                    <div>
                                        <DropdownMenu>
                                            Language:
                                            <DropdownMenuTrigger className="border-1 px-4">
                                                {language}
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuRadioGroup
                                                    value={language}
                                                    onValueChange={handleLanguageChange}
                                                >
                                                    {Object.keys(languageIds).map((lang) => (
                                                        <DropdownMenuRadioItem
                                                            key={lang}
                                                            value={lang}
                                                        >
                                                            {lang}
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="tertiary"
                                        size="default"
                                        className="min-w-20"
                                        onClick={goToNextTask}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                            <Editor
                                className="h-full"
                                defaultLanguage="python"
                                defaultValue=""
                                onMount={handleEditorContent}
                            />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={60} minSize={20}>
                            <div className="flex h-full flex-col border-1 p-2">
                                <div className="flex w-full items-center justify-between border-b-1 p-2">
                                    <div className="">Tests</div>
                                    <div className="flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="default"
                                            className="min-w-20"
                                            onClick={handleRunButton}
                                        >
                                            Run
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="default"
                                            className="min-w-20"
                                            onClick={handleSubmitButton}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 font-mono text-sm whitespace-pre-wrap">
                                    {output}
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
