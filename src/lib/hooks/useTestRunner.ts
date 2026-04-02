import { useState } from 'react';
import { runEditorSubmission, runAssessmentSubmission } from '@/lib/api/runner';
import { type JudgeResultRequestBody } from '@/lib/connectors/judge0.connector';
import { type ProgrammingLanguage } from '@/generated/prisma';
import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';

export default function useTestRunner(code: string, language: ProgrammingLanguage) {
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(false);
    const [output, setOutput] = useState<JudgeResultRequestBody>();

    async function runEditPageTests(tests: TestCaseDTO[]) {
        try {
            setLoading(true);
            const result = await runEditorSubmission({
                code,
                language,
                tests,
            });
            setOutput(result);
            console.warn(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function runAssessmentTests(taskTemplateId: string) {
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
        error,
        loading,
        output,
    };
}
