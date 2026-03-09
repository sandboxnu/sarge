import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

export function applySargeDarkTheme(
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: Monaco
): void {
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
    editorInstance.updateOptions({
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: 'none',
        overviewRulerLanes: 0,
    });
}
