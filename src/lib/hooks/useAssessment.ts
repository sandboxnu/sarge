'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import { toast } from 'sonner';
import { getCandidateAssessment, submitCandidateAssessment } from '@/lib/api/candidate-assessment';
import { useAssessmentTimer } from '@/lib/hooks/useAssessmentTimer';
import type {
    CandidateAssessment,
    CandidateTaskView,
    AssessmentQuestion,
} from '@/lib/types/candidate-assessment.types';

export type AssessmentPhase = 'intro' | 'assessment' | 'outro';
export type OutroReason = 'submitted' | 'expired';
export type SectionStatus = 'locked' | 'current' | 'completed';

export type TestCaseResult = {
    status: 'default' | 'loading' | 'passed' | 'failed' | 'runtime_error';
    actualOutput?: string;
};

export type SectionState = {
    taskTemplateId: string;
    order: number;
    taskTemplate: CandidateTaskView;
    status: SectionStatus;
    code: string;
    language: string;
    testCaseResults: TestCaseResult[];
};

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
                setAssessment(data);
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
            } catch (_err) {
                toast.error('Failed to submit assessment. Please try again.');
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

    function updateCode(code: string) {
        setSections((prev) => prev.map((s, i) => (i === currentSectionIndex ? { ...s, code } : s)));
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

    // TODO: Replace with Judge0 execution
    function runTests() {
        const section = sections[currentSectionIndex];
        if (!section) return;
        if (section.testCaseResults.some((r) => r.status === 'loading')) return;

        const MOCK_STATUSES = ['passed', 'failed', 'runtime_error'] as const;

        setSections((prev) =>
            prev.map((s, i) =>
                i === currentSectionIndex
                    ? {
                          ...s,
                          testCaseResults: s.testCaseResults.map(() => ({
                              status: 'loading' as const,
                          })),
                      }
                    : s
            )
        );

        setTimeout(() => {
            setSections((prev) =>
                prev.map((s, i) => {
                    if (i !== currentSectionIndex) return s;
                    return {
                        ...s,
                        testCaseResults: s.testCaseResults.map((_, idx) => {
                            const status =
                                MOCK_STATUSES[Math.floor(Math.random() * MOCK_STATUSES.length)];
                            const tc = section.taskTemplate.publicTestCases[idx];
                            if (status === 'passed')
                                return { status, actualOutput: tc?.output ?? '' };
                            if (status === 'runtime_error')
                                return {
                                    status,
                                    actualOutput: 'Timeout Error: Execution Time Exceeded',
                                };
                            return { status, actualOutput: 'wrong_answer' };
                        }),
                    };
                })
            );
        }, 1500);
    }

    function handleEditorMount(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editorInstance;
        monacoRef.current = monaco;
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
        isLoading,
        isSubmitting,
        isTransitioning,
        error,
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
