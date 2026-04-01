import { useState } from 'react';
import { runEditorSubmission, runAssessmentSubmission } from '@/lib/api/runner';
import { type JudgeResultRequestBody } from '@/lib/connectors/judge0.connector';
import { type ProgrammingLanguage } from '@/generated/prisma';

export default function useTestRunner(taskTemplateId: string) {
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<ProgrammingLanguage>('python');
    const [output, setOutput] = useState<JudgeResultRequestBody>();

    async function runEditPageTests() {
        try {
            setLoading(true);
            const result = await runEditorSubmission({
                code: 'x=input()\nprint(x)',
                language,
                tests: [{ input: '2', output: '2' }],
            });
            setOutput(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function runAssessmentTests() {
        try {
            setLoading(true);
            const result = await runAssessmentSubmission(taskTemplateId, {
                code,
                language,
            });
            setOutput(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    return {
        runAssessmentTests,
        runEditPageTests,
        setCode,
        setLanguage,
        error,
        loading,
        output,
    };
}
