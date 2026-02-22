import { useState, useEffect, useRef } from 'react';
import { editTaskTemplate, getTaskTemplate } from '@/lib/api/task-templates';
import { getOrgTags } from '@/lib/api/tags';
import {
    type TestCaseDTO,
    type TaskTemplateEditorDTO,
    type TaskTemplateEditorSaveDTO,
} from '@/lib/schemas/task-template.schema';
import { type TagDTO } from '@/lib/schemas/tag.schema';
import { type TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';
import { type BlockNoteContent } from '@/lib/types/task-template.types';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';
import { applySargeDarkTheme } from '@/lib/utils/monaco.utils';
import { toast } from 'sonner';

export default function useTaskTemplateEditPage(taskTemplateId: string) {
    const [taskTemplate, setTaskTemplate] = useState<TaskTemplateEditorDTO | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Sidebar
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<BlockNoteContent>([]);
    const [tags, setTags] = useState<TagDTO[]>([]);
    const [availableTags, setAvailableTags] = useState<TagDTO[]>([]);
    const [languages, setLanguages] = useState<TaskTemplateLanguageDTO[]>();
    const [selectedLanguage, setSelectedLanguage] = useState<number>(0);

    // Editor
    const [activeFileTab, setActiveFileTab] = useState<'task' | 'solution'>('task');
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const editorModels = useRef<{ [key: string]: editor.ITextModel }>({});
    const currentModelKeyRef = useRef<string | null>(null);

    // Tests
    const [publicTestCases, setPublicTestCases] = useState<TestCaseDTO[]>([]);
    const [privateTestCases, setPrivateTestCases] = useState<TestCaseDTO[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskTemplate, orgTags] = await Promise.all([
                    getTaskTemplate(taskTemplateId),
                    getOrgTags(),
                ]);

                setTaskTemplate(taskTemplate);
                setTitle(taskTemplate.title);
                setLanguages(taskTemplate.languages);
                setDescription((taskTemplate.description ?? []) as BlockNoteContent);
                setPrivateTestCases(taskTemplate.privateTestCases);
                setPublicTestCases(taskTemplate.publicTestCases);
                setTags(taskTemplate.tags);
                setAvailableTags(orgTags);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [taskTemplateId]);

    function handleLanguageChange(language: number) {
        handleModelChange(language, true);
        setSelectedLanguage(language);
    }

    function handleModelChange(language: number, task: boolean) {
        if (!editorRef.current || !monacoRef.current || !languages) return;
        const languageData = languages[language];
        const newStub = task ? languageData.stub : languageData.solution;
        const key = task ? `${languageData.language}` : `${languageData.language}-solution`;

        const newModel =
            editorModels.current[key] ||
            monacoRef.current.editor.createModel(newStub, languageData.language);
        if (newModel) {
            editorModels.current[key] = newModel;
            editorRef.current.setModel(newModel);
            currentModelKeyRef.current = key;
        }
    }

    function handleEditorContent(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editorInstance;
        monacoRef.current = monaco;
        applySargeDarkTheme(editorInstance, monaco);
    }

    function handleTaskSolutionToggle(tab: 'task' | 'solution') {
        setActiveFileTab(tab);
        handleModelChange(selectedLanguage, tab === 'task');
    }

    function getEditorContent(): string {
        if (!editorRef.current) return '';

        return editorRef.current.getValue();
    }

    function syncActiveEditorModel() {
        if (!editorRef.current || !languages) return;

        const liveModel = editorRef.current.getModel();
        if (!liveModel) return;

        if (currentModelKeyRef.current) {
            if (!editorModels.current[currentModelKeyRef.current]) {
                editorModels.current[currentModelKeyRef.current] = liveModel;
            }
        } else {
            const lang = languages[selectedLanguage];
            if (lang) {
                const key = `${lang.language}`;
                editorModels.current[key] = liveModel;
                currentModelKeyRef.current = key;
            }
        }
    }

    function getSavePayload(): TaskTemplateEditorSaveDTO {
        syncActiveEditorModel();

        const updatedLanguages = (languages ?? []).map((lang): TaskTemplateLanguageDTO => {
            const stubKey = `${lang.language}`;
            const solutionKey = `${lang.language}-solution`;

            const stub = editorModels.current[stubKey]?.getValue() ?? lang.stub;
            const solution = editorModels.current[solutionKey]?.getValue() ?? lang.solution;

            return {
                id: lang.id,
                language: lang.language,
                stub,
                solution,
                taskTemplateId,
            };
        });

        return {
            id: taskTemplateId,
            taskType: taskTemplate?.taskType ?? null,
            title,
            description,
            tags: tags.map((tag) => tag.id),
            publicTestCases,
            privateTestCases,
            languages: updatedLanguages,
        };
    }

    async function saveTaskTemplate() {
        try {
            setIsSaving(true);
            const payload = getSavePayload();
            await editTaskTemplate(taskTemplateId, payload);
            toast.success('Successfuly saved task template');
        } catch (err) {
            setError(err as Error);
            toast.error((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    }

    return {
        taskTemplate,
        error,
        isLoading,
        title,
        description,
        setTitle,
        setDescription,
        setTags,
        setLanguages,
        privateTestCases,
        setPrivateTestCases,
        publicTestCases,
        setPublicTestCases,
        tags,
        availableTags,
        setAvailableTags,
        languages,
        handleLanguageChange,
        selectedLanguage,
        activeFileTab,
        handleEditorContent,
        getEditorContent,
        handleTaskSolutionToggle,
        isSaving,
        saveTaskTemplate,
    };
}
