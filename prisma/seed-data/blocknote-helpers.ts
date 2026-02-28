export const defaultProps = {
    textColor: 'default' as const,
    backgroundColor: 'default' as const,
    textAlignment: 'left' as const,
};

export type InlineContentInput =
    | string
    | { text: string; bold?: boolean; code?: boolean; italic?: boolean };

export function normalizeContent(c: InlineContentInput) {
    if (typeof c === 'string') {
        return { type: 'text' as const, text: c, styles: {} };
    }
    const { text, bold, code, italic } = c;
    const styles: Record<string, boolean> = {};
    if (bold) styles.bold = true;
    if (code) styles.code = true;
    if (italic) styles.italic = true;
    return { type: 'text' as const, text, styles };
}

export function paragraph(id: string, content: InlineContentInput[]) {
    return {
        id,
        type: 'paragraph' as const,
        props: defaultProps,
        content: content.map(normalizeContent),
        children: [] as object[],
    };
}

export function heading(id: string, level: 1 | 2 | 3, content: InlineContentInput[]) {
    return {
        id,
        type: 'heading' as const,
        props: { ...defaultProps, level },
        content: content.map(normalizeContent),
        children: [] as object[],
    };
}
