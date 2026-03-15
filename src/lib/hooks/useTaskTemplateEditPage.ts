import { useState, useEffect, useRef, useCallback } from 'react';
import {
    getTaskTemplate,
    getTaskTemplateLanguage,
    editTaskTemplate,
    generateTaskTemplateLanguageStub,
    type GenerateTaskTemplateStubPayload,
} from '@/lib/api/task-templates';
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
    const tempIdSeedRef = useRef<{ lastTs: number; seq: number }>({ lastTs: 0, seq: 0 });

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
                setDescription(taskTemplate.description ?? []);
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
        (languageData: TaskTemplateLanguageDTO | null, tab: 'task' | 'solution') => {
            if (!editorRef.current || !monacoRef.current) return;

            const isTaskTab = tab === 'task';

            if (!languageData) {
                const key = isTaskTab ? 'empty-main' : 'empty-solution';
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
            const newStub = isTaskTab ? languageData.stub : languageData.solution;
            const key = isTaskTab
                ? `${languageData.language}`
                : `${languageData.language}-solution`;

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

    const generateTempLanguageId = useCallback((): number => {
        const seed = tempIdSeedRef.current;
        const ts = Date.now();

        if (seed.lastTs === ts) {
            seed.seq += 1;
        } else {
            seed.lastTs = ts;
            seed.seq = 0;
        }

        const int4Max = 2_147_483_647;
        const timeComponent = ts % 2_000_000_000;
        const combined = (timeComponent * 1000 + (seed.seq % 1000)) % int4Max;
        return -(combined || 1);
    }, []);

    function handleLanguageChange(language: TaskTemplateLanguageDTO) {
        const selected = languages?.indexOf(language);
        if (selected === undefined || selected === -1) return;
        handleModelChange(selected, activeFileTab);
        setSelectedLanguage(selected);
    }

    function handleModelChange(languageIndex: number, tab: 'task' | 'solution') {
        if (!editorRef.current || !monacoRef.current) return;

        if (languageIndex === -1 || !languages || languages.length === 0) {
            switchEditorModel(null, tab);
            return;
        }

        const languageData = languages[languageIndex] ?? null;
        switchEditorModel(languageData, tab);
    }

    function handleEditorContent(editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) {
        editorRef.current = editorInstance;
        monacoRef.current = monaco;
        applySargeDarkTheme(editorInstance, monaco);
    }

    function handleTaskSolutionToggle(tab: 'task' | 'solution') {
        setActiveFileTab(tab);
        handleModelChange(selectedLanguage, tab);
        if (!languages || languages.length === 0) {
            switchEditorModel(null, tab);
        }
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
            timeLimitMinutes: taskTemplate?.timeLimitMinutes ?? 0,
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
            const updatedTaskTemplate = await editTaskTemplate(taskTemplateId, payload);
            setTaskTemplate(updatedTaskTemplate);
            setLanguages(updatedTaskTemplate.languages);
            toast.success('Successfuly saved task template');
        } catch (err) {
            setError(err as Error);
            toast.error((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    }

    const generateStubsForLanguages = useCallback(
        async (stubConfig: GenerateTaskTemplateStubPayload) => {
            const currentLanguages = languages ?? [];
            if (currentLanguages.length === 0) return;

            const languagesToGenerate = currentLanguages.filter((lang) => !lang.stub?.trim());

            if (languagesToGenerate.length === 0) {
                toast.info('All selected languages already have stubs');
                return;
            }

            try {
                const generated = await Promise.all(
                    languagesToGenerate.map(async (lang) => {
                        const result = await generateTaskTemplateLanguageStub(
                            taskTemplateId,
                            lang.id,
                            {
                                ...stubConfig,
                                language: lang.language,
                            }
                        );

                        return {
                            id: lang.id,
                            stub: result.stub,
                        };
                    })
                );

                const generatedById = new Map(generated.map((item) => [item.id, item.stub]));

                // Update Monaco models so the editor reflects the new stubs immediately
                generated.forEach(({ id, stub }) => {
                    const lang = currentLanguages.find((l) => l.id === id);
                    if (lang) {
                        editorModels.current[lang.language]?.setValue(stub);
                    }
                });

                setLanguages((prev) =>
                    (prev ?? []).map((lang) => ({
                        ...lang,
                        stub: generatedById.get(lang.id) ?? lang.stub,
                    }))
                );
                setTaskTemplate((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        languages: prev.languages.map((lang) => ({
                            ...lang,
                            stub: generatedById.get(lang.id) ?? lang.stub,
                        })),
                    };
                });
                toast.success('Successfully generated stubs for selected languages');
            } catch (err) {
                setError(err as Error);
                toast.error((err as Error).message);
            }
        },
        [languages, taskTemplateId]
    );

    const removeLanguage = useCallback(
        (lang: string) => {
            setLanguages((prev) => {
                const filtered = (prev ?? []).filter((l) => l.language !== lang);

                if (filtered.length === 0) {
                    setSelectedLanguage(-1);
                    switchEditorModel(null, activeFileTab);
                } else {
                    setSelectedLanguage(0);
                    switchEditorModel(filtered[0] ?? null, activeFileTab);
                }

                return filtered;
            });
        },
        [activeFileTab, switchEditorModel]
    );

    const clearAllLanguages = useCallback(() => {
        setLanguages([]);
        setSelectedLanguage(-1);
        switchEditorModel(null, activeFileTab);
    }, [activeFileTab, switchEditorModel]);

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
                            id: generateTempLanguageId(),
                            taskTemplateId,
                            language: lang as TaskTemplateLanguageDTO['language'],
                            solution: '',
                            stub: '',
                        };
                    });

                const updated = [...existing, ...newEntries];

                if (selectedLanguage === -1 && updated.length > 0) {
                    setSelectedLanguage(0);
                    switchEditorModel(updated[0] ?? null, activeFileTab);
                }

                return updated;
            });
        },
        [taskTemplateId, selectedLanguage, activeFileTab, switchEditorModel, generateTempLanguageId]
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
                        switchEditorModel(null, activeFileTab);
                    } else {
                        setSelectedLanguage(0);
                        switchEditorModel(filtered[0] ?? null, activeFileTab);
                    }

                    return filtered;
                });
            }

            if (langsToAdd.length > 0) {
                addLanguages(langsToAdd);
            }
        },
        [languages, activeFileTab, switchEditorModel, addLanguages]
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
        activeFileTab,
        handleEditorContent,
        getEditorContent,
        handleTaskSolutionToggle,
        isSaving,
        saveTaskTemplate,
        removeLanguage,
        clearAllLanguages,
        handleLanguageSelectionChange,
        generateStubsForLanguages,
    };
}
