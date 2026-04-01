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
    status: 'default' | 'loading' | 'passed' | 'failed';
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

export default function useAssessment(assessmentId: string, token: string) {
    const [phase, setPhase] = useState<AssessmentPhase>('intro');
    const [outroReason, setOutroReason] = useState<OutroReason>('submitted');
    const [assessment, setAssessment] = useState<CandidateAssessment | null>(null);
    const [sections, setSections] = useState<SectionState[]>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);

    const totalTimeSeconds = sections.reduce(
        (sum, s) => sum + (s.taskTemplate.estimatedTime ?? 0),
        0
    );

    const timer = useAssessmentTimer(totalTimeSeconds, phase === 'assessment');

    useEffect(() => {
        if (!token) {
            setError(new Error('Missing assessment access token'));
            setIsLoading(false);
            return;
        }

        async function fetchAssessment() {
            try {
                setIsLoading(true);
                const data = await getCandidateAssessment(assessmentId, token);
                setAssessment(data);
                setSections(buildInitialSections(data.assessmentTemplate.tasks));
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAssessment();
    }, [assessmentId, token]);

    const handleSubmitAssessment = useCallback(
        async (reason: OutroReason) => {
            if (isSubmitting) return;
            try {
                setIsSubmitting(true);
                await submitCandidateAssessment(assessmentId, token);
                setOutroReason(reason);
                setPhase('outro');
            } catch (err) {
                toast.error('Failed to submit assessment. Please try again.');
                setIsSubmitting(false);
            }
        },
        [assessmentId, token, isSubmitting]
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

        const currentCode = editorRef.current?.getValue() ?? sections[currentSectionIndex]?.code ?? '';

        setSections((prev) =>
            prev.map((s, i) => {
                if (i === currentSectionIndex) return { ...s, code: currentCode, status: 'completed' };
                if (!isLastSection && i === currentSectionIndex + 1) return { ...s, status: 'current' };
                return s;
            })
        );

        if (isLastSection) {
            handleSubmitAssessment('submitted');
        } else {
            setCurrentSectionIndex((prev) => prev + 1);
        }
    }

    function updateCode(code: string) {
        setSections((prev) =>
            prev.map((s, i) => (i === currentSectionIndex ? { ...s, code } : s))
        );
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

    function runTests() {
        toast.info('Test execution coming soon');
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
