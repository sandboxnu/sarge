import { useState, useEffect, useRef, useCallback } from 'react';
import { getTaskTemplate, getTaskTemplateLanguage } from '@/lib/api/task-templates';
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
    const [isTaskTab, setIsTaskTab] = useState<boolean>(true);

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
                setSelectedLanguage(taskTemplate.languages.length > 0 ? 0 : -1);
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

    const switchEditorModel = useCallback(
        (languageData: TaskTemplateLanguageDTO | null, task: boolean) => {
            if (!editorRef.current || !monacoRef.current) return;

            if (!languageData) {
                const key = task ? 'empty-main' : 'empty-solution';
                const existingModel = editorModels.current[key];
                if (existingModel) {
                    editorRef.current.setModel(existingModel);
                } else {
                    const newModel = monacoRef.current.editor.createModel('', 'plaintext');
                    editorModels.current[key] = newModel;
                    editorRef.current.setModel(newModel);
                }
                return;
            }

            // Switch to language-specific model
            const newStub = task ? languageData.stub : languageData.solution;
            const key = task ? `${languageData.language}` : `${languageData.language}-solution`;

            const newModel =
                editorModels.current[key] ||
                monacoRef.current.editor.createModel(newStub, languageData.language);
            if (newModel) {
                editorModels.current[key] = newModel;
                editorRef.current.setModel(newModel);
            }
        },
        []
    );

    function handleLanguageChange(language: TaskTemplateLanguageDTO) {
        const selected = languages?.indexOf(language);
        if (selected === undefined || selected === -1) return;
        handleModelChange(selected, isTaskTab);
        setSelectedLanguage(selected);
    }

    function handleModelChange(languageIndex: number, task: boolean) {
        if (!editorRef.current || !monacoRef.current) return;

        if (languageIndex === -1 || !languages || languages.length === 0) {
            switchEditorModel(null, task);
            return;
        }

        const languageData = languages[languageIndex] ?? null;
        switchEditorModel(languageData, task);
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

        if (!languages || languages.length === 0) {
            switchEditorModel(null, isTaskTab);
        }
    }

    function handleTaskSolutionToggle(tab: string) {
        const task = tab === 'task';
        setIsTaskTab(task);
        handleModelChange(selectedLanguage, task);
    }

    function getEditorContent(): string {
        if (!editorRef.current) return '';

        return editorRef.current.getValue();
    }

    const removeLanguage = useCallback(
        (lang: string) => {
            setLanguages((prev) => {
                const filtered = (prev ?? []).filter((l) => l.language !== lang);

                if (filtered.length === 0) {
                    setSelectedLanguage(-1);
                    switchEditorModel(null, isTaskTab);
                } else {
                    setSelectedLanguage(0);
                    switchEditorModel(filtered[0] ?? null, isTaskTab);
                }

                return filtered;
            });
        },
        [isTaskTab, switchEditorModel]
    );

    const clearAllLanguages = useCallback(() => {
        setLanguages([]);
        setSelectedLanguage(-1);
        switchEditorModel(null, isTaskTab);
    }, [isTaskTab, switchEditorModel]);

    const addLanguages = useCallback(
        async (newLangNames: string[]) => {
            if (newLangNames.length === 0) return;
            const fetchedLanguages = await Promise.all(
                newLangNames.map(async (lang) => {
                    try {
                        const existingLang = await getTaskTemplateLanguage(taskTemplateId, lang);
                        return existingLang;
                    } catch {
                        return null;
                    }
                })
            );

            setLanguages((prev) => {
                const existing = prev ?? [];
                const existingLangNames = existing.map((l) => l.language);

                const newEntries: TaskTemplateLanguageDTO[] = newLangNames
                    .filter(
                        (lang) =>
                            !existingLangNames.includes(lang as TaskTemplateLanguageDTO['language'])
                    )
                    .map((lang, i) => {
                        const fetched = fetchedLanguages[i];
                        if (fetched) {
                            return fetched as TaskTemplateLanguageDTO;
                        }
                        return {
                            id: -(Date.now() + i),
                            taskTemplateId,
                            language: lang as TaskTemplateLanguageDTO['language'],
                            solution: '',
                            stub: '',
                        };
                    });

                const updated = [...existing, ...newEntries];

                if (selectedLanguage === -1 && updated.length > 0) {
                    setSelectedLanguage(0);
                    switchEditorModel(updated[0] ?? null, isTaskTab);
                }

                return updated;
            });
        },
        [taskTemplateId, selectedLanguage, isTaskTab, switchEditorModel]
    );

    const handleLanguageSelectionChange = useCallback(
        (selected: string | string[]) => {
            const selectedArr = Array.isArray(selected) ? selected : [selected];
            const currentLangs = (languages ?? []).map((l) => l.language);

            const langsToRemove = currentLangs.filter((lang) => !selectedArr.includes(lang));

            const langsToAdd = selectedArr.filter(
                (lang) => !currentLangs.includes(lang as TaskTemplateLanguageDTO['language'])
            );

            if (langsToRemove.length > 0) {
                setLanguages((prev) => {
                    const filtered = (prev ?? []).filter((l) => selectedArr.includes(l.language));

                    if (filtered.length === 0) {
                        setSelectedLanguage(-1);
                        switchEditorModel(null, isTaskTab);
                    } else {
                        setSelectedLanguage(0);
                        switchEditorModel(filtered[0] ?? null, isTaskTab);
                    }

                    return filtered;
                });
            }

            if (langsToAdd.length > 0) {
                addLanguages(langsToAdd);
            }
        },
        [languages, isTaskTab, switchEditorModel, addLanguages]
    );

    return {
        taskTemplate,
        error,
        isLoading,
        title,
        description,
        setTitle,
        setDescription,
        setTags,
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
        removeLanguage,
        clearAllLanguages,
        handleLanguageSelectionChange,
    };
}
