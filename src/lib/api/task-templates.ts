import type { TaskTemplateDetail } from '@/lib/types/task-template.types';

/**
 * GET /api/task-templates/:taskTemplateId
 */
export async function getTaskTemplate(taskTemplateId: string): Promise<TaskTemplateDetail> {
    const res = await fetch(`/api/task-templates/${taskTemplateId}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
