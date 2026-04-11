import { useState } from 'react';
import { runEditorSubmission, runAssessmentSubmission } from '@/lib/api/runner';
import { type ProgrammingLanguage } from '@/generated/prisma';
import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { CandidateTestResult } from '@/lib/types/candidate-assessment.types';

export default function useTestRunner() {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [output, setOutput] = useState<CandidateTestResult[]>();

    function reset() {
        setError(null);
        setLoading(false);
        setOutput(undefined);
    }

    async function runEditPageTests(
        tests: TestCaseDTO[],
        code: string,
        language: ProgrammingLanguage
    ) {
        try {
            setLoading(true);
            const result = await runEditorSubmission({
                code,
                language,
                tests,
            });
            setOutput(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function runAssessmentTests(
        taskTemplateId: string,
        code: string,
        language: ProgrammingLanguage
    ) {
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
        reset,
        error,
        loading,
        output,
    };
}
