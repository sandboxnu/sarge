import { type TagDTO, type CreateTagInput } from '@/lib/schemas/tag.schema';

/**
 * GET /api/tags
 * Fetches all tags for the current org.
 */
export async function getOrgTags(): Promise<TagDTO[]> {
    const res = await fetch('/api/tags');
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * POST /api/tags
 * Creates a new tag in the current org.
 */
export async function createTag(data: CreateTagInput): Promise<TagDTO> {
    const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
