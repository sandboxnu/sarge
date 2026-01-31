import { type TaskTemplate } from '@/generated/prisma';

/**
 * GET /api/task-templates/:taskTemplateId
 */
export async function getTaskTemplate(taskTemplateId: string): Promise<TaskTemplate> {
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
export async function searchTaskTemplates(title: string): Promise<TaskTemplate[]> {
    const res = await fetch(`/api/task-templates/search?title=${title}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
