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
        if (!editorRef.current || !monacoRef.current) return;
        const model = editorRef.current.getModel();
        setSelectedLanguage(language);
        if (model) {
            monacoRef.current.editor.setModelLanguage(model, '');
            editorRef.current.setValue('');
        }
    }

    // function handleEditorContent(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
    //     editorRef.current = editor;
    //     monacoRef.current = monaco;
    // }

    // function getEditorContent(): string {
    //     if (!editorRef.current) return '';
    //
    //     return editorRef.current.getValue();
    // }

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
    };
}
