import { useState, useEffect, useRef, useCallback } from 'react';
import type { PartialBlock } from '@blocknote/core';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { EditableTestCase, StarterCode, TaskTemplateDetail } from '@/lib/types/task-template.types';
import { useMonacoEditor } from '@/lib/hooks/useMonacoEditor';
import { useCodeRunner } from '@/lib/hooks/useCodeRunner';

function convertToEditableTestCases(template: TaskTemplateDetail): EditableTestCase[] {
    const publicCases = (template.publicTestCases || []).map((tc, idx) => ({
        id: `public-${idx}`,
        input: tc.input,
        output: tc.output,
        isPublic: true,
    }));
    const privateCases = (template.privateTestCases || []).map((tc, idx) => ({
        id: `private-${idx}`,
        input: tc.input,
        output: tc.output,
        isPublic: false,
    }));
    return [...publicCases, ...privateCases];
}

export function useTaskTemplateEditor(initialTemplate: TaskTemplateDetail) {
    const router = useRouter();
    const initialTemplateRef = useRef(initialTemplate);

    const [title, setTitle] = useState(initialTemplate.title);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [description, setDescription] = useState<PartialBlock<any, any, any>[]>(
        initialTemplate.description ?? []
    );
    const [testCases, setTestCases] = useState<EditableTestCase[]>(
        convertToEditableTestCases(initialTemplate)
    );
    const [starterCodes, setStarterCodes] = useState<StarterCode[]>(
        initialTemplate.starterCodes ?? []
    );
    const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(
        testCases.length > 0 ? testCases[0].id : null
    );
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        editorRef,
        monacoRef,
        currentLanguage,
        handleEditorMount,
        handleLanguageChange: monacoLanguageChange,
        getCurrentCode,
    } = useMonacoEditor({
        initialLanguage: 'python',
        initialStarterCodes: initialTemplate.starterCodes ?? [],
        onStarterCodesChange: setStarterCodes,
    });

    const { isRunning, testOutput, runCode, availableLanguages } = useCodeRunner();

    useEffect(() => {
        const initial = initialTemplateRef.current;
        const isChanged =
            title !== initial.title ||
            JSON.stringify(description) !== JSON.stringify(initial.description) ||
            JSON.stringify(testCases) !== JSON.stringify(convertToEditableTestCases(initial)) ||
            JSON.stringify(starterCodes) !== JSON.stringify(initial.starterCodes ?? []);
        setHasUnsavedChanges(isChanged);
    }, [title, description, testCases, starterCodes]);

    const handleAddTestCase = useCallback(() => {
        const newId = `public-${Date.now()}`;
        setTestCases((prev) => [...prev, { id: newId, input: '', output: '', isPublic: true }]);
        setSelectedTestCaseId(newId);
    }, []);

    const handleDeleteTestCase = useCallback((id: string) => {
        setTestCases((prev) => {
            const tc = prev.find((t) => t.id === id);
            if (!tc) return prev;

            const publicCount = prev.filter((t) => t.isPublic).length;
            if (tc.isPublic && publicCount === 1) {
                toast.error('Cannot delete the only public test case');
                return prev;
            }

            if ((tc.input || tc.output) && !confirm('Delete this test case?')) {
                return prev;
            }

            const updated = prev.filter((t) => t.id !== id);
            setSelectedTestCaseId((currentId) =>
                currentId === id && updated.length > 0 ? updated[0].id : currentId
            );
            return updated;
        });
    }, []);

    const handleUpdateTestCase = useCallback((id: string, field: 'input' | 'output', value: string) => {
        setTestCases((prev) => prev.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)));
    }, []);

    const handleToggleTestCaseVisibility = useCallback((id: string) => {
        setTestCases((prev) => {
            const tc = prev.find((t) => t.id === id);
            if (!tc) return prev;

            const publicCount = prev.filter((t) => t.isPublic).length;
            if (tc.isPublic && publicCount === 1) {
                toast.error('Cannot make the only public test case private');
                return prev;
            }

            return prev.map((t) => (t.id === id ? { ...t, isPublic: !t.isPublic } : t));
        });
    }, []);

    const handleLanguageChange = useCallback(
        (newLanguage: string) => {
            monacoLanguageChange(newLanguage);
        },
        [monacoLanguageChange]
    );

    const handleRunCode = useCallback(async () => {
        const testCase = testCases.find((tc) => tc.id === selectedTestCaseId);
        if (!testCase) {
            toast.error('No test case selected');
            return;
        }

        const code = getCurrentCode();
        if (!code) {
            toast.error('No code to run');
            return;
        }

        await runCode(code, currentLanguage, testCase);
    }, [testCases, selectedTestCaseId, getCurrentCode, currentLanguage, runCode]);

    const handleSave = useCallback(async () => {
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        const publicTestCases = testCases.filter((tc) => tc.isPublic);
        if (publicTestCases.length === 0) {
            toast.error('At least one public test case is required');
            return;
        }

        const currentCode = getCurrentCode();
        let finalStarterCodes = starterCodes;
        if (currentCode) {
            const idx = starterCodes.findIndex((sc) => sc.language === currentLanguage);
            if (idx >= 0) {
                finalStarterCodes = [...starterCodes];
                finalStarterCodes[idx] = { language: currentLanguage, code: currentCode };
            } else {
                finalStarterCodes = [...starterCodes, { language: currentLanguage, code: currentCode }];
            }
        }

        setIsSaving(true);

        try {
            const payload = {
                title,
                description,
                publicTestCases: testCases
                    .filter((tc) => tc.isPublic)
                    .map((tc) => ({ input: tc.input, output: tc.output })),
                privateTestCases: testCases
                    .filter((tc) => !tc.isPublic)
                    .map((tc) => ({ input: tc.input, output: tc.output })),
                starterCodes: finalStarterCodes.map((sc) => ({ language: sc.language, code: sc.code })),
            };

            const response = await fetch(`/api/task-templates/${initialTemplate.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message ?? 'Save failed');
            }

            const result = await response.json();
            initialTemplateRef.current = result.data;
            setStarterCodes(finalStarterCodes);
            setHasUnsavedChanges(false);
            toast.success('Task template saved successfully');
        } catch (err) {
            toast.error(`Failed to save: ${(err as Error).message}`);
        } finally {
            setIsSaving(false);
        }
    }, [title, description, testCases, starterCodes, currentLanguage, getCurrentCode, initialTemplate.id]);

    const handleCancel = useCallback(() => {
        if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
        router.push('/crm/task-templates');
    }, [hasUnsavedChanges, router]);

    return {
        title,
        setTitle,
        description,
        setDescription,
        testCases,
        starterCodes,
        currentLanguage,
        selectedTestCaseId,
        hasUnsavedChanges,
        isSaving,
        testOutput,
        isRunning,
        editorRef,
        monacoRef,
        handleAddTestCase,
        handleDeleteTestCase,
        handleUpdateTestCase,
        handleToggleTestCaseVisibility,
        handleSelectTestCase: setSelectedTestCaseId,
        handleEditorMount,
        handleLanguageChange,
        handleRunCode,
        handleSave,
        handleCancel,
        availableLanguages,
    };
}
