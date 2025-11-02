import { useEffect, useState, useRef } from 'react';
import { type TaskTemplateDTO } from '@/lib/schemas/taskTemplate.schema';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import {
    type JudgeResultRequestBody,
    type JudgeSubmissionRequestBody,
} from '@/lib/connectors/judge0.connector';
import { sleep } from '@/lib/utils/utils';

const languageIds: Record<string, number> = {
    python: 100,
    javascript: 102,
};

async function createSubmission(payload: JudgeSubmissionRequestBody[]): Promise<string[]> {
    const response = await fetch('/api/judge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('fetch unsuccessful');
    }

    const body = await response.json();
    return body.data;
}

async function getSubmission(tokens: string[]): Promise<JudgeResultRequestBody[]> {
    const response = await fetch(`/api/judge?tokens=${tokens.join(',')}`);

    if (!response.ok) {
        throw new Error('fetch unsuccessful');
    }

    const body = await response.json();
    return body;
}

export function useTask(id: string) {
    const [task, setTask] = useState<TaskTemplateDTO | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [language, setLanguage] = useState<string>('python');
    const [output, setOutput] = useState<string>('Output will appear here...');
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/taskTemplates/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch task template');
                }
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message);
                }
                setTask(data.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    function handleEditorContent(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }

    function handleLanguageChange(lang: string) {
        if (!editorRef.current || !monacoRef.current) return;
        setLanguage(lang);
        const model = editorRef.current.getModel();
        if (model) {
            monacoRef.current.editor.setModelLanguage(model, lang);
            editorRef.current.setValue('');
        }
    }

    async function handleRunButton(): Promise<JudgeResultRequestBody | undefined> {
        try {
            if (!editorRef.current) {
                setOutput('Error: Code editor has not initialized');
                return;
            }
            if (!task) {
                setOutput('Error: Task data is not loaded');
                return;
            }

            setOutput('Running code...');
            const source_code = editorRef.current.getValue();
            const firstCase = task.public_test_cases[0];
            const payload: JudgeSubmissionRequestBody[] = [
                {
                    source_code,
                    language_id: languageIds[language],
                    stdin: firstCase.input,
                    expected_output: firstCase.output,
                },
            ];

            const tokens = await createSubmission(payload);
            if (!tokens || tokens.length === 0) {
                throw new Error(
                    `No tokens received from Judge0 for payload ${JSON.stringify(payload, null, 2)}`
                );
            }
            await sleep(5000);
            const results = await getSubmission(tokens);

            setOutput(`Judge0 Results: ${JSON.stringify(results, null, 2)}`);
            return results[0];
        } catch (err) {
            setOutput(`An error occurred while running the code: ${(err as Error).message}`);
        }
    }

    async function handleSubmitButton() {
        try {
            if (!editorRef.current) {
                setOutput('Error: Code editor has not initialized');
                return;
            }

            setOutput('Submitting code...');
            const source_code = editorRef.current.getValue();
            const payload: JudgeSubmissionRequestBody[] = [];
            for (const testCase of [
                ...(task?.public_test_cases ?? []),
                ...(task?.private_test_cases ?? []),
            ]) {
                payload.push({
                    source_code,
                    language_id: languageIds[language],
                    stdin: testCase.input,
                    expected_output: testCase.output,
                });
            }

            const tokens = await createSubmission(payload);
            if (!tokens || tokens.length === 0) {
                throw new Error(
                    `No tokens received from Judge0 for payload ${JSON.stringify(payload, null, 2)}`
                );
            }
            await sleep(5000);
            const results = await getSubmission(tokens);

            setOutput(`Judge0 Results: ${JSON.stringify(results, null, 2)}`);
        } catch (err) {
            setOutput(`An error occurred while submitting the code: ${(err as Error).message}`);
        }
    }

    return {
        task,
        isLoading,
        error,
        language,
        output,
        handleEditorContent,
        handleLanguageChange,
        handleRunButton,
        handleSubmitButton,
        languageIds,
    };
}
