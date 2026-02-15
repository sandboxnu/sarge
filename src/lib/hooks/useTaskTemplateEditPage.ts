import { useState, useEffect, useRef } from 'react';
import { getTaskTemplate } from '@/lib/api/task-templates';
import { getOrgTags } from '@/lib/api/tags';
import { type TestCaseDTO, type TaskTemplateEditorDTO } from '@/lib/schemas/task-template.schema';
import { type TagDTO } from '@/lib/schemas/tag.schema';
import { type TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';
import { type BlockNoteContent } from '@/lib/types/task-template.types';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';

export default function useTaskTemplateEditPage(taskTemplateId: string) {
    const [taskTemplate, setTaskTemplate] = useState<TaskTemplateEditorDTO | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Sidebar
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<BlockNoteContent>([]);
    const [tags, setTags] = useState<TagDTO[]>([]);
    const [availableTags, setAvailableTags] = useState<TagDTO[]>([]);
    const [languages, setLanguages] = useState<TaskTemplateLanguageDTO[]>();
    const [selectedLanguage, setSelectedLanguage] = useState<number>(0);

    // Editor
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const editorModels = useRef<{ [key: string]: editor.ITextModel }>({});

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
        handleModelChange(language, false);
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
        }
    }

    function handleEditorContent(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editor;
        monacoRef.current = monaco;
        monaco.editor.defineTheme('sargeDark', {
            base: 'vs-dark',
            inherit: true,
            rules: [{ token: '', foreground: 'FFFFFF' }],
            colors: {
                'editor.background': '#384150',
                'editor.foreground': '#FFFFFF',
                'editor.lineHighlightBorder': '#384150',
            },
        });
        monaco.editor.setTheme('sargeDark');
        editor.updateOptions({ minimap: { enabled: false } });
    }

    function handleTaskSolutionToggle(tab: string) {
        const task = tab == 'task' ? true : false;
        handleModelChange(selectedLanguage, task);
    }

    function getEditorContent(): string {
        if (!editorRef.current) return '';

        return editorRef.current.getValue();
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
        handleEditorContent,
        getEditorContent,
        handleTaskSolutionToggle,
    };
}
