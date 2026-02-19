import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';

/**
 * GET /api/assessment-templates/search/?title=...
 */
export async function searchAssessmentTemplates(
    title: string
): Promise<AssessmentTemplateListItemDTO[]> {
    const res = await fetch(`/api/assessment-templates/search?title=${title}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/assessment-templates?page=...&limit=...
 */
export async function getAssessmentTemplateList(
    page: number,
    limit: number
): Promise<{ data: AssessmentTemplateListItemDTO[]; total: number }> {
    const res = await fetch(`/api/assessment-templates?page=${page}&limit=${limit}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json;
}
