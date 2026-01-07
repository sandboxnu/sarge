import { type TaskDTO, type CreateTaskDTO } from '@/lib/schemas/task.schema';

/**
 * POST /api/tasks
 */
export async function createTask(payload: CreateTaskDTO): Promise<TaskDTO> {
    const res = await fetch(`/api/tasks`, {
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

/**
 * PUT /api/tasks/:taskId
 */
export async function updateTask(taskId: string, candidateCode: string): Promise<TaskDTO> {
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            candidateCode,
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
