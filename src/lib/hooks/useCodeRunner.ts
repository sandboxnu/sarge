import { useState, useCallback } from 'react';
import { sleep } from '@/lib/utils/utils';
import { AVAILABLE_LANGUAGES, JUDGE0_LANGUAGE_ID_MAP } from '@/lib/constants/judge0-languages';

export interface TestCaseInput {
    input: string;
    output: string;
}

export interface UseCodeRunnerResult {
    isRunning: boolean;
    testOutput: string;
    runCode: (code: string, language: string, testCase: TestCaseInput) => Promise<void>;
    availableLanguages: string[];
}

export function useCodeRunner(): UseCodeRunnerResult {
    const [isRunning, setIsRunning] = useState(false);
    const [testOutput, setTestOutput] = useState('');

    const runCode = useCallback(async (code: string, language: string, testCase: TestCaseInput) => {
        setIsRunning(true);
        setTestOutput('Running code...');

        try {
            const languageId = JUDGE0_LANGUAGE_ID_MAP[language];
            if (!languageId) {
                throw new Error(`Unsupported language: ${language}`);
            }

            const payload = [
                {
                    source_code: code,
                    language_id: languageId,
                    stdin: testCase.input,
                    expected_output: testCase.output,
                },
            ];

            const response = await fetch('/api/judge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to submit code');

            const { data: tokens } = await response.json();
            await sleep(5000);

            const resultsResponse = await fetch(`/api/judge?tokens=${tokens.join(',')}`);
            const results = await resultsResponse.json();
            const result = results[0];

            if (result.status_id === 3) {
                setTestOutput(
                    `PASSED\n\nOutput:\n${result.stdout}\n\nExpected:\n${testCase.output}`
                );
            } else {
                setTestOutput(
                    `FAILED\n\nStatus: ${JSON.stringify(result.status)}\n\nOutput:\n${result.stdout ?? result.stderr ?? 'No output'}`
                );
            }
        } catch (err) {
            setTestOutput(`Error: ${(err as Error).message}`);
        } finally {
            setIsRunning(false);
        }
    }, []);

    return {
        isRunning,
        testOutput,
        runCode,
        availableLanguages: [...AVAILABLE_LANGUAGES],
    };
}
