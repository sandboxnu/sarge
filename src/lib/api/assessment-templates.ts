import {
    type AssessmentTemplateListItemDTO,
    type AssessmentTemplateDetailDTO,
    type CreateAssessmentTemplateDTO,
} from '@/lib/schemas/assessment-template.schema';
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
 * GET /api/assessment-templates/:id
 * Returns full template with ordered tasks, author, positions.
 */
export async function getAssessmentTemplate(id: string): Promise<AssessmentTemplateDetailDTO> {
    const res = await fetch(`/api/assessment-templates/${id}`);
    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * PUT /api/assessment-templates/:id
 * Updates metadata: title, internalNotes.
 */
export async function updateAssessmentTemplate(
    id: string,
    data: { title?: string; internalNotes?: unknown }
): Promise<void> {
    const res = await fetch(`/api/assessment-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }
}

/**
 * PUT /api/assessment-templates/:id/tasks
 * Bulk-replaces the ordered task list.
 */
export async function updateAssessmentTemplateTasks(
    id: string,
    tasks: { taskTemplateId: string }[]
): Promise<void> {
    const res = await fetch(`/api/assessment-templates/${id}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }
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

/**
 * POST /api/assessment-templates
 */
export async function createAssessmentTemplate(
    payload: CreateAssessmentTemplateDTO
): Promise<AssessmentTemplateListItemDTO> {
    const res = await fetch(`/api/assessment-templates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
