import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/lib/components/ui/Resizable';
import CodeEditorPanel from '@/lib/components/core/CodeEditorPanel';
import AssessmentTestCasesPanel from '@/lib/components/assessment-flow/AssessmentTestCasesPanel';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import type { SectionState } from '@/lib/hooks/useAssessment';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestCaseResult } from '@/lib/hooks/useAssessment';
import type { TaskLanguageOption } from '@/lib/types/candidate-assessment.types';
import { BlockNoteViewer } from '@/lib/components/core/BlockNoteViewer';
import { HighlightGuard } from '@/lib/components/core/HighlightGuard';

type AssessmentContentProps = {
    currentSection: SectionState | null;
    availableLanguages: TaskLanguageOption[];
    publicTestCases: TestCaseDTO[];
    testCaseResults: TestCaseResult[];
    isTransitioning: boolean;
    onLanguageChange: (lang: string) => void;
    onEditorMount: (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
    onRunTests: () => void;
    onSubmit: () => void;
};

export default function AssessmentContent({
    currentSection,
    availableLanguages,
    publicTestCases,
    testCaseResults,
    isTransitioning,
    onLanguageChange,
    onEditorMount,
    onRunTests,
    onSubmit,
}: AssessmentContentProps) {
    if (!currentSection) return null;

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={35} minSize={20}>
                <div
                    key={`${currentSection.taskTemplateId}-desc`}
                    className={
                        isTransitioning
                            ? 'flex h-full flex-col opacity-0 transition-opacity duration-150'
                            : 'animate-section-enter flex h-full flex-col'
                    }
                >
                    <div className="box-content shrink-0 px-5 pt-4 pb-2">
                        <h1 className="text-sarge-gray-900 text-3xl font-bold tracking-tight">
                            {currentSection.taskTemplate.title}
                        </h1>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <HighlightGuard className="h-full overflow-y-auto px-5 pt-1 pb-4">
                            <div data-oa-task-description className="min-h-0">
                                <BlockNoteViewer
                                    content={currentSection.taskTemplate.description}
                                />
                            </div>
                        </HighlightGuard>
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle className="bg-sarge-gray-200 hover:bg-sarge-primary-300 w-px transition-colors" />

            <ResizablePanel defaultSize={65} minSize={40}>
                <div
                    key={`${currentSection.taskTemplateId}-code`}
                    className={
                        isTransitioning
                            ? 'flex h-full flex-col overflow-hidden opacity-0 transition-opacity duration-150'
                            : 'animate-section-enter flex h-full flex-col overflow-hidden'
                    }
                >
                    <div className="min-h-0 flex-1">
                        <CodeEditorPanel
                            language={currentSection.language}
                            availableLanguages={availableLanguages}
                            onLanguageChange={onLanguageChange}
                            onEditorMount={onEditorMount}
                            defaultValue={currentSection.code}
                        />
                    </div>
                    <AssessmentTestCasesPanel
                        testCases={publicTestCases}
                        results={testCaseResults}
                        onRunTests={onRunTests}
                        onSubmit={onSubmit}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
