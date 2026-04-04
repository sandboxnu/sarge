import { type TagDTO, type CreateTagInput } from '@/lib/schemas/tag.schema';

/**
 * GET /api/task-template-tags
 * Fetches all task template tags for the current org.
 */
export async function getOrgTaskTemplateTags(): Promise<TagDTO[]> {
    const res = await fetch('/api/task-template-tags');
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
}

/**
 * POST /api/task-template-tags
 * Creates a new task template tag in the current org.
 */
export async function createTaskTemplateTag(data: CreateTagInput): Promise<TagDTO> {
    const res = await fetch('/api/task-template-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
}