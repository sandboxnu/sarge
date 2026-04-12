import { type TagDTO, type CreateTagInput } from '@/lib/schemas/tag.schema';

/**
 * GET /api/tags/position
 * Fetches all position tags for the current org.
 */
export async function getOrgPositionTags(): Promise<TagDTO[]> {
    const res = await fetch('/api/tags/position');
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
}

/**
 * POST /api/tags/position
 * Creates a new position tag in the current org.
 */
export async function createPositionTag(data: CreateTagInput): Promise<TagDTO> {
    const res = await fetch('/api/tags/position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    return json.data;
}
