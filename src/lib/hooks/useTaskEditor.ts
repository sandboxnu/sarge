import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type {
    BlockNoteContent,
    EditableTestCase,
    StarterCode,
    Tag,
    TaskTemplateDetail,
} from '@/lib/types/task-template.types';
import { AVAILABLE_LANGUAGES } from '@/lib/constants/judge0-languages';
import { useMonacoEditor } from '@/lib/hooks/useMonacoEditor';

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

export function useTaskEditor(initialTemplate: TaskTemplateDetail) {
    const router = useRouter();

    const [title, setTitle] = useState(initialTemplate.title);
    const [description, setDescription] = useState<BlockNoteContent>(
        initialTemplate.description ?? []
    );
    const [tags, setTags] = useState<Tag[]>(initialTemplate.tags ?? []);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() => {
        const languagesFromStarterCodes = [
            ...new Set(initialTemplate.starterCodes?.map((sc) => sc.language) ?? []),
        ];
        return languagesFromStarterCodes.length > 0
            ? languagesFromStarterCodes
            : [...AVAILABLE_LANGUAGES];
    });
    const [testCases, setTestCases] = useState<EditableTestCase[]>(
        convertToEditableTestCases(initialTemplate)
    );
    const [starterCodes, setStarterCodes] = useState<StarterCode[]>(
        initialTemplate.starterCodes ?? []
    );
    const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | null>(
        testCases.length > 0 ? testCases[0].id : null
    );
    const [recommendedTimeMinutes, setRecommendedTimeMinutes] = useState(
        initialTemplate.recommendedTimeMinutes ?? 30
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [testOutput, setTestOutput] = useState('');

    const {
        editorRef,
        monacoRef,
        currentLanguage,
        handleEditorMount,
        handleLanguageChange: monacoLanguageChange,
        getCurrentCode,
    } = useMonacoEditor({
        initialLanguage: selectedLanguages[0] ?? 'python',
        initialStarterCodes: initialTemplate.starterCodes ?? [],
        onStarterCodesChange: setStarterCodes,
    });

    // TODO: Implement unsaved changes tracking
    // This is a skeleton implementation for future PR
    const hasUnsavedChanges = false;

    const handleAddTestCase = useCallback(
        (seed?: Pick<EditableTestCase, 'input' | 'output' | 'isPublic'>) => {
            const visibilityPrefix = seed?.isPublic === false ? 'private' : 'public';
            const newId = `${visibilityPrefix}-${Date.now()}`;
            setTestCases((prev) => [
                ...prev,
                {
                    id: newId,
                    input: seed?.input ?? '',
                    output: seed?.output ?? '',
                    isPublic: seed?.isPublic ?? true,
                },
            ]);
            setSelectedTestCaseId(newId);
            return newId;
        },
        []
    );

    const handleDeleteTestCase = useCallback((id: string) => {
        setTestCases((prev) => {
            const tc = prev.find((t) => t.id === id);
            if (!tc) return prev;

            const publicCount = prev.filter((t) => t.isPublic).length;
            if (tc.isPublic && publicCount === 1) {
                toast.error('Cannot delete the only public test case');
                return prev;
            }

            if (!confirm('Delete this test case?')) {
                return prev;
            }

            const updated = prev.filter((t) => t.id !== id);
            setSelectedTestCaseId((currentId) =>
                currentId === id && updated.length > 0 ? updated[0].id : currentId
            );
            return updated;
        });
    }, []);

    const handleUpdateTestCase = useCallback(
        (id: string, field: 'input' | 'output', value: string) => {
            setTestCases((prev) =>
                prev.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc))
            );
        },
        []
    );

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
        setIsRunning(true);
        setTestOutput('');

        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsRunning(false);
        setTestOutput('');
    }, []);

    const handleSave = useCallback(async () => {
        // TODO: Implement save functionality
    }, []);

    return {
        title,
        setTitle,
        description,
        setDescription,
        tags,
        setTags,
        selectedLanguages,
        setSelectedLanguages,
        recommendedTimeMinutes,
        setRecommendedTimeMinutes,
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
    };
}
