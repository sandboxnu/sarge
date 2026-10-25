import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';

// NOTE: scopes the gutter overrides in globals.css to Sarge editors
const SARGE_EDITOR_CLASS = 'sarge-code-editor';
const CODE_FONT_SIZE = 13;
const CODE_LINE_HEIGHT = 23;

function getCodeFontFamily(): string {
    const fontFamily = getComputedStyle(document.body)
        .getPropertyValue('--font-jetbrains-mono')
        .trim();
    return fontFamily || 'monospace';
}

export function applySargeDarkTheme(
    editorInstance: editor.IStandaloneCodeEditor,
    monaco: Monaco
): void {
    monaco.editor.defineTheme('sargeDark', {
        base: 'vs-dark',
        // NOTE: inherit is off so vs-dark's syntax colors are dropped, the design is monochrome
        // except for Python, whose rules are scoped by the .python token suffix
        inherit: false,
        rules: [
            { token: '', foreground: 'F9FAFE', background: '212429' },
            { token: 'keyword.python', foreground: '569CD6' },
            { token: 'string.python', foreground: 'CE9178' },
            { token: 'string.escape.python', foreground: 'D7BA7D' },
            { token: 'comment.python', foreground: '6A9955' },
            { token: 'number.python', foreground: 'B5CEA8' },
            { token: 'type.identifier.python', foreground: '4EC9B0' },
            { token: 'tag.python', foreground: 'DCDCAA' },
        ],
        colors: {
            'editor.background': '#212429',
            'editor.foreground': '#F9FAFE',
            'editorGutter.background': '#212429',
            'editorLineNumber.foreground': '#5B6274',
            'editorLineNumber.activeForeground': '#5B6274',
            'editor.lineHighlightBorder': '#212429',
            // NOTE: bracket pair colorization is decided at model creation, so neutralize its colors here
            'editorBracketHighlight.foreground1': '#F9FAFE',
            'editorBracketHighlight.foreground2': '#F9FAFE',
            'editorBracketHighlight.foreground3': '#F9FAFE',
            'editorBracketHighlight.foreground4': '#F9FAFE',
            'editorBracketHighlight.foreground5': '#F9FAFE',
            'editorBracketHighlight.foreground6': '#F9FAFE',
        },
    });
    monaco.editor.setTheme('sargeDark');

    const fontFamily = getCodeFontFamily();
    editorInstance.getContainerDomNode().classList.add(SARGE_EDITOR_CLASS);
    editorInstance.updateOptions({
        fontFamily,
        fontSize: CODE_FONT_SIZE,
        lineHeight: CODE_LINE_HEIGHT,
        fontLigatures: true,
        padding: { top: 16, bottom: 16 },
        glyphMargin: false,
        folding: false,
        lineNumbersMinChars: 4,
        // NOTE: 16px gap + 1px divider + 16px gap between the line numbers and the code
        lineDecorationsWidth: 33,
        guides: { indentation: false },
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: 'none',
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        // NOTE: Ctrl + scroll (Cmd + scroll on macOS) zooms, shared by every editor on the page
        mouseWheelZoom: true,
    });

    // NOTE: Monaco measures glyph widths once, so re-measure after the web font loads or the cursor drifts
    document.fonts
        .load(`${CODE_FONT_SIZE}px ${fontFamily}`)
        .then(() => monaco.editor.remeasureFonts())
        .catch(() => {});
}
