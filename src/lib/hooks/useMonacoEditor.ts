import { useRef, useCallback, useState } from 'react';
import { type editor } from 'monaco-editor';
import { type Monaco } from '@monaco-editor/react';

export interface StarterCodeEntry {
    language: string;
    code: string;
}

export interface UseMonacoEditorOptions {
    initialLanguage?: string;
    initialStarterCodes?: StarterCodeEntry[];
    onStarterCodesChange?: (starterCodes: StarterCodeEntry[]) => void;
}

export interface UseMonacoEditorResult {
    editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
    monacoRef: React.RefObject<Monaco | null>;
    currentLanguage: string;
    handleEditorMount: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
    handleLanguageChange: (newLanguage: string) => boolean;
    getCurrentCode: () => string;
    setCurrentCode: (code: string) => void;
}

export function useMonacoEditor({
    initialLanguage = 'python',
    initialStarterCodes = [],
    onStarterCodesChange,
}: UseMonacoEditorOptions = {}): UseMonacoEditorResult {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const currentLanguageRef = useRef(initialLanguage);
    const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
    const starterCodesRef = useRef<StarterCodeEntry[]>(initialStarterCodes);

    const getCurrentCode = useCallback(() => {
        return editorRef.current?.getValue() ?? '';
    }, []);

    const setCurrentCode = useCallback((code: string) => {
        editorRef.current?.setValue(code);
    }, []);

    const saveCurrentCodeToStarterCodes = useCallback(() => {
        const code = getCurrentCode();
        if (!code) return;

        const language = currentLanguageRef.current;
        const existing = starterCodesRef.current;
        const idx = existing.findIndex((sc) => sc.language === language);

        let updated: StarterCodeEntry[];
        if (idx >= 0) {
            updated = [...existing];
            updated[idx] = { language, code };
        } else {
            updated = [...existing, { language, code }];
        }

        starterCodesRef.current = updated;
        onStarterCodesChange?.(updated);
    }, [getCurrentCode, onStarterCodesChange]);

    const handleEditorMount = useCallback(
        (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;

            const starterCode = starterCodesRef.current.find(
                (sc) => sc.language === currentLanguageRef.current
            );
            if (starterCode) {
                editor.setValue(starterCode.code);
            }
        },
        []
    );

    const handleLanguageChange = useCallback(
        (newLanguage: string): boolean => {
            if (!editorRef.current || !monacoRef.current) return false;

            const currentCode = getCurrentCode();
            const currentStarterCode = starterCodesRef.current.find(
                (sc) => sc.language === currentLanguageRef.current
            );

            if (currentCode && currentCode !== currentStarterCode?.code) {
                if (!confirm('Switching language will replace your current code. Continue?')) {
                    return false;
                }
            }

            saveCurrentCodeToStarterCodes();

            currentLanguageRef.current = newLanguage;
            setCurrentLanguage(newLanguage);
            const model = editorRef.current.getModel();
            if (model) {
                monacoRef.current.editor.setModelLanguage(model, newLanguage);
                const newStarterCode = starterCodesRef.current.find(
                    (sc) => sc.language === newLanguage
                );
                editorRef.current.setValue(newStarterCode?.code ?? '');
            }

            return true;
        },
        [getCurrentCode, saveCurrentCodeToStarterCodes]
    );

    return {
        editorRef,
        monacoRef,
        currentLanguage,
        handleEditorMount,
        handleLanguageChange,
        getCurrentCode,
        setCurrentCode,
    };
}
