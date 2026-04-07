'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import { toast } from 'sonner';
import { getCandidateAssessment, submitCandidateAssessment } from '@/lib/api/candidate-assessment';
import { useAssessmentTimer } from '@/lib/hooks/useAssessmentTimer';
import useTestRunner from '@/lib/hooks/useTestRunner';
import type {
    AssessmentPhase,
    AssessmentQuestion,
    CandidateAssessment,
    OutroReason,
    SectionState,
    TestCaseResultStatus,
} from '@/lib/types/candidate-assessment.types';
import { createToken } from '@/lib/api/token';
import { type ProgrammingLanguage } from '@/generated/prisma';

function buildInitialSections(questions: AssessmentQuestion[]): SectionState[] {
    return questions.map((q, i) => {
        const defaultLanguage = q.taskTemplate.languages[0]?.language ?? 'python';
        const defaultStub = q.taskTemplate.languages[0]?.stub ?? '';
        return {
            taskTemplateId: q.taskTemplateId,
            order: q.order,
            taskTemplate: q.taskTemplate,
            status: i === 0 ? 'current' : 'locked',
            code: defaultStub,
            language: defaultLanguage,
            testCaseResults: q.taskTemplate.publicTestCases.map(() => ({
                status: 'default' as const,
            })),
        };
    });
}

export default function useAssessment(assessmentId: string) {
    const [phase, setPhase] = useState<AssessmentPhase>('intro');
    const [outroReason, setOutroReason] = useState<OutroReason>('submitted');
    const [assessment, setAssessment] = useState<CandidateAssessment | null>(null);
    const [sections, setSections] = useState<SectionState[]>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const [token, setToken] = useState<string>();

    const currentSectionIndexRef = useRef(currentSectionIndex);
    useEffect(() => {
        currentSectionIndexRef.current = currentSectionIndex;
    }, [currentSectionIndex]);

    const {
        error: testError,
        loading: testLoading,
        output: testOutput,
        runAssessmentTests,
        reset: resetTests,
    } = useTestRunner();

    useEffect(() => {
        if (testLoading) {
            setSections((prev) =>
                prev.map((section) => ({
                    ...section,
                    testCaseResults: section.testCaseResults.map((test) => ({
                        ...test,
                        status: 'loading',
                    })),
                }))
            );
        } else if (testError) {
            setSections((prev) =>
                prev.map((section) => ({
                    ...section,
                    testCaseResults: section.testCaseResults.map((test) => ({
                        ...test,
                        status: 'runtime_error',
                        actualOutput: 'An error occurred while running tests.',
                    })),
                }))
            );
        } else if (testOutput) {
            setSections((prev) =>
                prev.map((section) => {
                    return {
                        ...section,
                        testCaseResults: section.testCaseResults.map((test, i) => ({
                            ...test,
                            status: resolveStatusId(testOutput[i]?.statusId ?? 0),
                            actualOutput: testOutput[i]?.stdout ?? testOutput[i]?.stderr ?? '',
                        })),
                    };
                })
            );
        }
    }, [testLoading, testError, testOutput, currentSectionIndex]);

    function resolveStatusId(statusId: number): TestCaseResultStatus {
        switch (statusId) {
            case 3:
                return 'passed';
            case 5:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
                return 'runtime_error';
            case 4:
                return 'failed';
            default:
                return 'failed';
        }
    }

    // the timer is in seconds however our model is in minutes
    const totalEstimatedMinutes = sections.reduce(
        (sum, s) => sum + (s.taskTemplate.estimatedTime ?? 0),
        0
    );
    const totalTimeSeconds = totalEstimatedMinutes * 60;

    const timer = useAssessmentTimer(totalTimeSeconds, phase === 'assessment');

    useEffect(() => {
        async function fetchAssessment() {
            try {
                setIsLoading(true);
                const data = await getCandidateAssessment(assessmentId);
                const token = await createToken(data.candidateEmail);
                setAssessment(data);
                setToken(token);
                setSections(buildInitialSections(data.assessmentTemplate.tasks));
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAssessment();
    }, [assessmentId]);

    const handleSubmitAssessment = useCallback(
        async (reason: OutroReason) => {
            if (isSubmitting) return;
            try {
                setIsSubmitting(true);
                await submitCandidateAssessment(assessmentId);
                setOutroReason(reason);
                setPhase('outro');
            } catch (err) {
                toast.error(`Failed to submit assessment. Please try again. Error: ${err}`);
                setIsSubmitting(false);
            }
        },
        [assessmentId, isSubmitting]
    );

    // auto-submit when timer expires
    useEffect(() => {
        if (timer.isExpired && phase === 'assessment') {
            handleSubmitAssessment('expired');
        }
    }, [timer.isExpired, phase, handleSubmitAssessment]);

    function startAssessment() {
        setPhase('assessment');
    }

    function submitAndContinue() {
        const isLastSection = currentSectionIndex === sections.length - 1;

        const currentCode =
            editorRef.current?.getValue() ?? sections[currentSectionIndex]?.code ?? '';

        if (isLastSection) {
            setSections((prev) =>
                prev.map((s, i) =>
                    i === currentSectionIndex ? { ...s, code: currentCode, status: 'completed' } : s
                )
            );
            handleSubmitAssessment('submitted');
        } else {
            setIsTransitioning(true);
            resetTests();
            setTimeout(() => {
                setSections((prev) =>
                    prev.map((s, i) => {
                        if (i === currentSectionIndex)
                            return { ...s, code: currentCode, status: 'completed' };
                        if (i === currentSectionIndex + 1) return { ...s, status: 'current' };
                        return s;
                    })
                );
                setCurrentSectionIndex((prev) => prev + 1);
                setIsTransitioning(false);
            }, 200);
        }
    }

    function updateCode() {
        const code = editorRef.current?.getValue() ?? '';
        setSections((prev) => prev.map((s, i) => (i === currentSectionIndex ? { ...s, code } : s)));

        return code;
    }

    function runTests() {
        const code = updateCode() || '';
        const section = sections[currentSectionIndex];
        if (!section) return;

        runAssessmentTests(section.taskTemplateId, code, section.language as ProgrammingLanguage);
    }

    function changeLanguage(language: string) {
        const stub =
            sections[currentSectionIndex]?.taskTemplate.languages.find(
                (l) => l.language === language
            )?.stub ?? '';

        setSections((prev) =>
            prev.map((s, i) => (i === currentSectionIndex ? { ...s, language, code: stub } : s))
        );

        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
                monacoRef.current.editor.setModelLanguage(model, language);
            }
            editorRef.current.setValue(stub);
        }
    }

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editorInstance;
        monacoRef.current = monaco;

        editorInstance.onDidChangeModelContent(() => {
            updateCode();
        });
    }

    const currentSection = sections[currentSectionIndex] ?? null;

    return {
        phase,
        outroReason,
        assessment,
        candidateName: assessment?.candidateName ?? '',
        sections,
        currentSection,
        currentSectionIndex,
        totalTimeSeconds,
        timer,
        token,
        isLoading,
        isSubmitting,
        isTransitioning,
        error,
        testError,
        startAssessment,
        submitAndContinue,
        updateCode,
        changeLanguage,
        runTests,
        handleEditorMount,
        availableLanguages: currentSection?.taskTemplate.languages ?? [],
        publicTestCases: currentSection?.taskTemplate.publicTestCases ?? [],
        testCaseResults: currentSection?.testCaseResults ?? [],
    };
}
