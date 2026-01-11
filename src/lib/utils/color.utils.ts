const TAG_COLOR_MAP: Record<string, string> = {
    '#E9F3F7': '#487CA5',
    '#F6F3F8': '#8A67AB',
    '#F8ECDF': '#CC782F',
    '#F9F2F5': '#B35488',
    '#EEF3ED': '#548164',
    '#FAF3DD': '#C29343',
    '#F3EEEE': '#976D57',
    '#FAECEC': '#C4554D',
    '#F1F1EF': '#787774',
};

const DEFAULT_TEXT_COLOR = '#374151';

export function getTagTextColor(bgColor: string | null): string {
    if (!bgColor) return DEFAULT_TEXT_COLOR;
    return TAG_COLOR_MAP[bgColor] ?? DEFAULT_TEXT_COLOR;
}
