export const TASK_EDITOR_SECTIONS = [
    { id: 'details', label: 'Details' },
    { id: 'languages', label: 'Languages' },
    { id: 'code-stub', label: 'Code Stub' },
    { id: 'solution-tests', label: 'Solution / Tests' },
    { id: 'settings', label: 'Settings' },
] as const;

export type TaskEditorSectionId = (typeof TASK_EDITOR_SECTIONS)[number]['id'];
