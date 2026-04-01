import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/lib/components/ui/Resizable';
import TaskDescriptionPanel from '@/lib/components/assessment-flow/TaskDescriptionPanel';
import CodeEditorPanel from '@/lib/components/core/CodeEditorPanel';
import OATestCasesPanel from '@/lib/components/assessment-flow/OATestCasesPanel';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import type { SectionState } from '@/lib/hooks/useAssessment';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestCaseResult } from '@/lib/hooks/useAssessment';
import type { TaskLanguageOption } from '@/lib/types/candidate-assessment.types';

type AssessmentFlowContentProps = {
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

export default function AssessmentFlowContent({
    currentSection,
    availableLanguages,
    publicTestCases,
    testCaseResults,
    isTransitioning,
    onLanguageChange,
    onEditorMount,
    onRunTests,
    onSubmit,
}: AssessmentFlowContentProps) {
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
                        <TaskDescriptionPanel
                            description={currentSection.taskTemplate.description}
                        />
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
                    <OATestCasesPanel
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
