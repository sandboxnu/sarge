import {
    type TaskTemplateListItemDTO,
    type TaskTemplateEditorDTO,
    type CreateTaskTemplateDTO,
    type TaskTemplateDTO,
} from '@/lib/schemas/task-template.schema';

/**
 * GET /api/task-templates/:taskTemplateId
 */
export async function getTaskTemplate(taskTemplateId: string): Promise<TaskTemplateEditorDTO> {
    const res = await fetch(`/api/task-templates/${taskTemplateId}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/task-templates/search/?title=...
 */
export async function searchTaskTemplates(title: string): Promise<TaskTemplateListItemDTO[]> {
    const res = await fetch(`/api/task-templates/search?title=${title}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/task-templates?page=...&limit=...
 */
export async function getTaskTemplateList(
    page: number,
    limit: number
): Promise<{ data: TaskTemplateListItemDTO[]; total: number }> {
    const res = await fetch(`/api/task-templates?page=${page}&limit=${limit}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json;
}

/**
 * POST /api/task-templates/:taskTemplateId
 */
export async function duplicateTaskTemplate(
    taskTemplateId: string
): Promise<TaskTemplateListItemDTO> {
    const res = await fetch(`/api/task-templates/${taskTemplateId}`, {
        method: 'POST',
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * DELETE /api/task-templates/:taskTemplateId
 */
export async function deleteTaskTemplate(taskTemplateId: string): Promise<void> {
    const res = await fetch(`/api/task-templates/${taskTemplateId}`, {
        method: 'DELETE',
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json;
}

/**
 * POST /api/task-templates
 */
export async function createTaskTemplate(payload: CreateTaskTemplateDTO): Promise<TaskTemplateDTO> {
    const res = await fetch('/api/task-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/task-templates?duplicate=...
 */
export async function getDuplicateTitle(title: string): Promise<string> {
    const res = await fetch(`/api/task-templates/duplicate?name=${encodeURIComponent(title)}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/task-templates/:taskTemplateId/languages/:language
 */
export async function getTaskTemplateLanguage(
    taskTemplateId: string,
    language: string
): Promise<{
    id: number;
    taskTemplateId: string;
    language: string;
    solution: string;
    stub: string;
} | null> {
    const res = await fetch(
        `/api/task-templates/${taskTemplateId}/languages/${encodeURIComponent(language)}`
    );

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
