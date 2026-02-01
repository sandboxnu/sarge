import { type AssessmentTemplate } from '@/generated/prisma';

/**
 * GET /api/assessment-templates/search/?title=...
 */
export async function searchAssessmentTemplates(title: string): Promise<AssessmentTemplate[]> {
    const res = await fetch(`/api/assessment-templates/search?title=${title}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
