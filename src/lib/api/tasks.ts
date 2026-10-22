import { type TaskDTO, type CreateTaskDTO, type CreateCommentDTO } from '@/lib/schemas/task.schema';
import type { Comment } from '@/generated/prisma';

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
export async function updateTask(taskId: string, submission: string): Promise<TaskDTO> {
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            submission,
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * POST /api/tasks/:taskId/comments
 */
export async function createComment(taskId: string, payload: CreateCommentDTO): Promise<Comment> {
    const res = await fetch(`/api/tasks/${taskId}/comments`, {
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
