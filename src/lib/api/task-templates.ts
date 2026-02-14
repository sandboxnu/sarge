import { type TaskTemplate } from '@/generated/prisma';
import {
    type TaskTemplateListItemDTO,
    type TaskTemplateEditorDTO,
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
export async function getTaskList(
    page: number,
    limit: number
): Promise<{ data: TaskTemplateListItemDTO[]; total: number }> {
    const results = await fetch(`/api/task-templates?page=${page}&limit=${limit}`);

    const json = await results.json();

    if (!results.ok) {
        throw new Error(json.message);
    }

    return json;
}
