'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import { toast } from 'sonner';
import {
    createCandidateSnapshot,
    createCandidateTask,
    getCandidateAssessment,
    startCandidateAssessment,
    submitCandidateAssessment,
    submitCandidateTask,
} from '@/lib/api/candidate-assessment';
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
import { type ProgrammingLanguage, SnapshotType, TestVisibility } from '@/generated/prisma';

// TODO(laith): this should become configurable in the org settings eventually
const CONTENT_SNAPSHOT_INTERVAL_MS = 30_000;

function buildInitialSections(questions: AssessmentQuestion[]): SectionState[] {
    return questions.map((q, i) => {
        const defaultLanguage = q.taskTemplate.languages[0]?.language ?? 'python';
        const defaultStub = q.taskTemplate.languages[0]?.stub ?? '';
        return {
            taskTemplateId: q.taskTemplateId,
            taskId: null,
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
        (sum, s) => sum + s.taskTemplate.estimatedTime,
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

                const alreadyFinished =
                    data.assessmentStatus === 'SUBMITTED' || data.assessmentStatus === 'GRADED';
                const deadlinePassed =
                    data.deadline !== null && new Date(data.deadline).getTime() < Date.now();
                if (alreadyFinished) {
                    setOutroReason('submitted');
                    setPhase('outro');
                } else if (data.assessmentStatus === 'EXPIRED' || deadlinePassed) {
                    setPhase('expired');
                } else if (data.assessmentStatus === 'IN_PROGRESS') {
                    try {
                        await submitCandidateAssessment(assessmentId);
                    } catch {
                        // best effort submission, we should not allow progress to continue on a restart
                    }
                    setOutroReason('submitted');
                    setPhase('outro');
                }
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
                toast.error(`Assessment failed to submit. Please try again. Error: ${err}`);
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

    async function startAssessment() {
        try {
            await startCandidateAssessment(assessmentId);
            setPhase('assessment');
        } catch (err) {
            // NOTE(laith): we're definitely going to want better copy for candidate side errors eventually
            toast.error(`Failed to start assessment: ${(err as Error).message}`);
        }
    }

    // Creates a Task for the current section so snapshots have a taskId to attach to.
    useEffect(() => {
        if (phase !== 'assessment') return;
        const section = sections[currentSectionIndex];
        if (!section || section.taskId) return;
        createCandidateTask(assessmentId, section.taskTemplateId)
            .then((task) => {
                setSections((prev) =>
                    prev.map((s, i) => (i === currentSectionIndex ? { ...s, taskId: task.id } : s))
                );
            })
            .catch((err) => {
                toast.error(`Failed to start task: ${(err as Error).message}`);
            });
    }, [assessmentId, phase, currentSectionIndex, sections]);

    // Periodic CONTENT snapshot while the candidate is actively in a task.
    useEffect(() => {
        if (phase !== 'assessment') return;
        const section = sections[currentSectionIndex];
        if (!section?.taskId) return;
        const taskId = section.taskId;
        const interval = setInterval(() => {
            const code = editorRef.current?.getValue() ?? '';
            if (!code) return;
            // NOTE(laith): don't want this blocking so won't await
            createCandidateSnapshot(assessmentId, taskId, SnapshotType.CONTENT, code);
        }, CONTENT_SNAPSHOT_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [assessmentId, phase, currentSectionIndex, sections]);

    // Copy/paste anywhere on the page during the assessment phase records a COPYPASTE snapshot on the current task
    useEffect(() => {
        if (phase !== 'assessment') return;
        const section = sections[currentSectionIndex];
        if (!section?.taskId) return;
        const taskId = section.taskId;
        const callback = () => {
            createCandidateSnapshot(assessmentId, taskId, SnapshotType.COPYPASTE).catch(() => {});
        };
        document.addEventListener('copy', callback);
        document.addEventListener('paste', callback);
        return () => {
            document.removeEventListener('copy', callback);
            document.removeEventListener('paste', callback);
        };
    }, [assessmentId, phase, currentSectionIndex, sections]);

    function createTaskSubmissionPayload(section: SectionState, code: string) {
        const testResults = section.taskTemplate.publicTestCases.map((testCase, i) => ({
            visibility: TestVisibility.PUBLIC,
            passed: section.testCaseResults[i]?.status === 'passed',
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: section.testCaseResults[i]?.actualOutput ?? null,
        }));
        return {
            submission: code,
            language: section.language as ProgrammingLanguage,
            testResults,
        };
    }

    async function submitTaskAndContinue() {
        const isLastSection = currentSectionIndex === sections.length - 1;
        const section = sections[currentSectionIndex];
        if (!section) return;
        const currentCode = editorRef.current?.getValue() ?? section.code ?? '';
        const payload = createTaskSubmissionPayload(section, currentCode);

        if (isLastSection) {
            setSections((prev) =>
                prev.map((s, i) =>
                    i === currentSectionIndex ? { ...s, code: currentCode, status: 'completed' } : s
                )
            );

            // Unlike other task submissions, we want to await the final task submit so a network error
            // doesn't lose the candidate's last submission before the assessment is marked as completed
            if (section.taskId) {
                try {
                    await submitCandidateTask(assessmentId, section.taskId, payload);
                } catch (err) {
                    toast.error(`Failed to save your submission: ${(err as Error).message}`);
                }
            }
            handleSubmitAssessment('submitted');
        } else {
            setIsTransitioning(true);
            // NOTE(laith) don't want this blocking so don't await
            if (section.taskId) {
                submitCandidateTask(assessmentId, section.taskId, payload).catch((err) => {
                    toast.error(`Failed to save your submission: ${(err as Error).message}`);
                });
            }
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
                setSections((prev) =>
                    prev.map((s) => {
                        return {
                            ...s,
                            testCaseResults: s.testCaseResults.map(() => {
                                return { status: 'default' };
                            }),
                        };
                    })
                );
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
        submitTaskAndContinue,
        updateCode,
        changeLanguage,
        runTests,
        handleEditorMount,
        availableLanguages: currentSection?.taskTemplate.languages ?? [],
        publicTestCases: currentSection?.taskTemplate.publicTestCases ?? [],
        testCaseResults: currentSection?.testCaseResults ?? [],
    };
}
