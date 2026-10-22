'use client';

import dynamic from 'next/dynamic';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { Chip } from '@/lib/components/ui/Chip';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { getLanguageLabel, getLanguageFileExtension } from '@/lib/utils/language.utils';
import type { TaskWithReviewData } from '@/lib/types/position.types';
import type { TaskTestResult } from '@/generated/prisma';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import TestCasePanel from '@/lib/components/core/TestCasePanel';

const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.Editor), {
    ssr: false,
});

type ReviewTaskSubmissionProps = {
    task: TaskWithReviewData | null;
};

export default function ReviewTaskSubmission({ task }: ReviewTaskSubmissionProps) {
    const language = task?.language ?? null;
    const fileName = `main.${getLanguageFileExtension(language ?? '')}`;
    const submission = task?.submission ?? '';
    const testResults = task?.testResults ?? [];

    function toTestCase(result: TaskTestResult): TestCaseDTO {
        return { input: result.input, output: result.expectedOutput };
    }

    const publicTestCases = testResults.filter((r) => r.visibility === 'PUBLIC').map(toTestCase);
    const privateTestCases = testResults.filter((r) => r.visibility === 'PRIVATE').map(toTestCase);

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        applySargeDarkTheme(editorInstance, monaco);
    }

    return (
        <>
            <div className="bg-sarge-gray-700 flex min-h-0 basis-[60%] flex-col">
                <div className="text-sarge-gray-0 flex flex-shrink-0 items-stretch text-xs">
                    <div className="border-sarge-gray-600 flex flex-shrink-0 items-center border-r px-2.5 py-2">
                        <span className="tracking-design font-medium">{fileName}</span>
                    </div>
                    <div className="border-sarge-gray-600 flex flex-1 items-center justify-end gap-1.5 border-b px-2.5">
                        <span className="tracking-design text-xs font-medium">Language</span>
                        <Chip className="bg-sarge-primary-500 tracking-design text-primary-foreground rounded-sm px-2.5 py-0.5 text-xs font-medium">
                            {language ? getLanguageLabel(language) : 'txt'}
                        </Chip>
                    </div>
                </div>
                <div className="min-h-0 flex-1">
                    <Editor
                        height="100%"
                        language={language ?? 'plaintext'}
                        value={submission}
                        onMount={handleEditorMount}
                        theme="sargeDark"
                        options={{
                            readOnly: true,
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                        }}
                    />
                </div>
            </div>
            <TestCasePanel
                publicTestCases={publicTestCases}
                privateTestCases={privateTestCases}
                readOnly
            />
        </>
    );
}
