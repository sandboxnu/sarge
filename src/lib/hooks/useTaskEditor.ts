import { useState, useCallback } from 'react';
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
    const publicCases = (template.publicTestCases || []).map((testCase, index) => ({
        id: `public-${index}`,
        input: testCase.input,
        output: testCase.output,
        isPublic: true,
    }));
    const privateCases = (template.privateTestCases || []).map((testCase, index) => ({
        id: `private-${index}`,
        input: testCase.input,
        output: testCase.output,
        isPublic: false,
    }));
    return [...publicCases, ...privateCases];
}

export function useTaskEditor(initialTemplate: TaskTemplateDetail) {
    const [title, setTitle] = useState(initialTemplate.title);
    const [description, setDescription] = useState<BlockNoteContent>(
        initialTemplate.description ?? []
    );
    const [tags, setTags] = useState<Tag[]>(initialTemplate.tags ?? []);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() => {
        const languagesFromStarterCodes = [
            ...new Set(
                initialTemplate.starterCodes?.map((starterCode) => starterCode.language) ?? []
            ),
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
    const [recommendedTimeMinutes, setRecommendedTimeMinutes] = useState(
        initialTemplate.recommendedTimeMinutes ?? 30
    );
    const [isSaving, _setIsSaving] = useState(false); // TODO: Will be used when save functionality is implemented
    const [isRunning, setIsRunning] = useState(false);
    const [testOutput, setTestOutput] = useState('');

    const {
        editorRef,
        monacoRef,
        currentLanguage,
        handleEditorMount,
        handleLanguageChange: monacoLanguageChange,
        // getCurrentCode, // TODO: Will be used when handleRunCode is implemented
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
            const newTestCaseId = `${visibilityPrefix}-${Date.now()}`;
            setTestCases((prev) => [
                ...prev,
                {
                    id: newTestCaseId,
                    input: seed?.input ?? '',
                    output: seed?.output ?? '',
                    isPublic: seed?.isPublic ?? true,
                },
            ]);
            return newTestCaseId;
        },
        []
    );

    const handleDeleteTestCase = useCallback((id: string) => {
        setTestCases((prev) => {
            const testCase = prev.find((testCase) => testCase.id === id);
            if (!testCase) return prev;

            const publicCount = prev.filter((testCase) => testCase.isPublic).length;
            if (testCase.isPublic && publicCount === 1) {
                toast.error('Cannot delete the only public test case');
                return prev;
            }

            if (!confirm('Delete this test case?')) {
                return prev;
            }

            const remainingTestCases = prev.filter((testCase) => testCase.id !== id);
            return remainingTestCases;
        });
    }, []);

    const handleUpdateTestCase = useCallback(
        (id: string, field: 'input' | 'output', value: string) => {
            setTestCases((prev) =>
                prev.map((testCase) =>
                    testCase.id === id ? { ...testCase, [field]: value } : testCase
                )
            );
        },
        []
    );

    const handleToggleTestCaseVisibility = useCallback((id: string) => {
        setTestCases((prev) => {
            const testCase = prev.find((testCase) => testCase.id === id);
            if (!testCase) return prev;

            const publicCount = prev.filter((testCase) => testCase.isPublic).length;
            if (testCase.isPublic && publicCount === 1) {
                toast.error('Cannot make the only public test case private');
                return prev;
            }

            return prev.map((testCase) =>
                testCase.id === id ? { ...testCase, isPublic: !testCase.isPublic } : testCase
            );
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
        handleEditorMount,
        handleLanguageChange,
        handleRunCode,
        handleSave,
    };
}
