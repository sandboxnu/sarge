import { type TagDTO, type CreateTagInput } from '@/lib/schemas/tag.schema';

/**
 * GET /api/tags/task-template
 * Fetches all task template tags for the current org.
 */
export async function getOrgTaskTemplateTags(): Promise<TagDTO[]> {
    const res = await fetch('/api/tags/task-template');
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
}

/**
 * POST /api/tags/task-template
 * Creates a new task template tag in the current org.
 */
export async function createTaskTemplateTag(data: CreateTagInput): Promise<TagDTO> {
    const res = await fetch('/api/tags/task-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
}
