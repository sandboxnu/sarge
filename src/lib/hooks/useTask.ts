import { useEffect, useState, useRef } from 'react';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import judge0Connector, {
    type JudgeResultRequestBody,
    type JudgeSubmissionRequestBody,
} from '@/lib/connectors/judge0.connector';
import { type TaskTemplate } from '@/generated/prisma';
import { type CreateTaskDTO, type TaskDTO } from '@/lib/schemas/task.schema';
import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import { createTask, updateTask } from '@/lib/api/tasks';
import { getTaskTemplate } from '@/lib/api/task-templates';

const languageIds: Record<string, number> = {
    python: 100,
    javascript: 102,
};

export function useTask(taskTemplateId: string, assessmentId: string) {
    const [task, setTask] = useState<TaskDTO | null>(null);
    const [taskTemplate, setTaskTemplate] = useState<TaskTemplate | null>(null);
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
                const taskTemplate = await getTaskTemplate(taskTemplateId);

                setTaskTemplate(taskTemplate);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskTemplateId]);

    function handleEditorContent(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }

    function handleLanguageChange(lang: string) {
        if (!editorRef.current || !monacoRef.current) return;
        const model = editorRef.current.getModel();
        setLanguage(lang);
        if (model) {
            monacoRef.current.editor.setModelLanguage(model, lang);
            editorRef.current.setValue('');
        }
    }

    function getDefaultTestCaseIndexes(task: TaskTemplate): {
        publicIndexes: number[];
        privateIndexes: number[];
    } {
        const publicCases = task.publicTestCases || [];
        const privateCases = task.privateTestCases || [];

        if (publicCases.length > 0) {
            // Use up to 3 public test cases
            const count = Math.min(3, publicCases.length);
            return {
                publicIndexes: Array.from({ length: count }, (_, i) => i),
                privateIndexes: [],
            };
        } else if (privateCases.length > 0) {
            // If no public test cases, use up to 3 private test cases
            const count = Math.min(3, privateCases.length);
            return {
                publicIndexes: [],
                privateIndexes: Array.from({ length: count }, (_, i) => i),
            };
        }

        return { publicIndexes: [], privateIndexes: [] };
    }

    /**
     * Using indexes allows us to spot run specific test cases if we want
     * to allow that feature but we can change this if we want
     */
    async function handleRun(
        publicIndexes: number[],
        privateIndexes: number[]
    ): Promise<JudgeResultRequestBody[]> {
        try {
            if (!editorRef.current) {
                setOutput('Error: Code editor has not initialized');
                return [];
            }
            if (!taskTemplate) {
                setOutput('Error: Task data is not loaded');
                return [];
            }

            setOutput('Running code...');
            const source_code = editorRef.current.getValue();

            const publicCases = taskTemplate.publicTestCases || [];
            const privateCases = taskTemplate.privateTestCases || [];

            // Get specified test cases by index
            const testCasesToRun: TestCaseDTO[] = [
                ...publicIndexes
                    .map((idx) => publicCases[idx])
                    // converting a JsonValue | null | undefined -> TestCaseDTO
                    .filter((tc): tc is TestCaseDTO => Boolean(tc)),
                ...privateIndexes
                    .map((idx) => privateCases[idx])
                    .filter((tc): tc is TestCaseDTO => Boolean(tc)),
            ];

            const payload: JudgeSubmissionRequestBody[] = testCasesToRun.map((testCase) => ({
                source_code,
                language_id: languageIds[language],
                stdin: testCase.input,
                expected_output: testCase.output,
            }));

            const results = await judge0Connector.executeSubmissions(payload);

            setOutput(`Judge0 Results: ${JSON.stringify(results, null, 2)}`);
            return results;
        } catch (err) {
            setOutput(`An error occurred while running the code: ${(err as Error).message}`);
            return [];
        }
    }

    async function handleRunButton() {
        try {
            if (!taskTemplate) {
                setOutput('Error: Task data is not loaded');
                return [];
            }

            const defaultIndexes = getDefaultTestCaseIndexes(taskTemplate);
            return handleRun(defaultIndexes.publicIndexes, defaultIndexes.privateIndexes);
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
            if (!taskTemplate) {
                setOutput('Error: Task data is not loaded');
                return;
            }

            setOutput('Submitting code...');

            // Run all test cases by passing all indexes
            const publicCount = taskTemplate.publicTestCases?.length || 0;
            const privateCount = taskTemplate.privateTestCases?.length || 0;
            const allPublicIndexes = Array.from({ length: publicCount }, (_, i) => i);
            const allPrivateIndexes = Array.from({ length: privateCount }, (_, i) => i);

            const results = await handleRun(allPublicIndexes, allPrivateIndexes);
            await updateOrCreateTask(editorRef.current.getValue() || '');
            setOutput(`Submission complete! Results: ${JSON.stringify(results, null, 2)}`);
        } catch (err) {
            setOutput(`An error occurred while submitting the code: ${(err as Error).message}`);
        }
    }

    async function updateOrCreateTask(candidateCode: string) {
        try {
            if (task) {
                const updatedTask = await updateTask(task.id, candidateCode);

                setTask(updatedTask);
            } else {
                const createTaskPayload: CreateTaskDTO = {
                    assessmentId,
                    taskTemplateId,
                    candidateCode,
                };

                const task = await createTask(createTaskPayload);

                setTask(task);
            }
        } catch (error) {
            setError(error as Error);
        }
    }

    return {
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
    };
}
