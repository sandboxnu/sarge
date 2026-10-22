export type LineRange = { startLine: number; endLine: number };

export function formatLineRange({ startLine, endLine }: LineRange): string {
    return startLine === endLine ? `Line ${startLine}` : `Lines ${startLine}-${endLine}`;
}

// Dragging over whole lines ends the selection at column 1 of the next line; don't count that line
export function selectionToLineRange(sel: {
    startLineNumber: number;
    endLineNumber: number;
    endColumn: number;
}): LineRange {
    const endLine =
        sel.endColumn === 1 && sel.endLineNumber > sel.startLineNumber
            ? sel.endLineNumber - 1
            : sel.endLineNumber;
    return { startLine: sel.startLineNumber, endLine };
}
