import { prisma } from '@/lib/prisma';
import type {
    CreateTaskDTO,
    SubmitTaskForCandidateDTO,
    TaskDTO,
    UpdateTaskDTO,
} from '@/lib/schemas/task.schema';
import { BadRequestException, NotFoundException } from '@/lib/utils/errors.utils';
import { type Task, SnapshotType } from '@/generated/prisma';

async function getTask(id: string, orgId: string): Promise<TaskDTO> {
    const foundTask = await prisma.task.findFirst({
        where: {
            id,
            assessment: {
                application: {
                    position: {
                        orgId,
                    },
                },
            },
        },
    });

    if (!foundTask) {
        throw new NotFoundException(`Task with id ${id} not found`);
    }

    return foundTask;
}

async function createTask(task: CreateTaskDTO, orgId: string): Promise<TaskDTO> {
    const assessment = await prisma.assessment.findFirst({
        where: {
            id: task.assessmentId,
            application: {
                position: {
                    orgId,
                },
            },
        },
    });

    if (!assessment) {
        throw new NotFoundException(`Assessment with id ${task.assessmentId} not found`);
    }

    const taskTemplate = await prisma.taskTemplate.findFirst({
        where: {
            id: task.taskTemplateId,
            orgId,
        },
        select: { id: true },
    });

    if (!taskTemplate) {
        throw new NotFoundException(`Task Template with id ${task.taskTemplateId} not found`);
    }

    const newTask = await prisma.task.create({
        data: {
            assessmentId: task.assessmentId,
            taskTemplateId: task.taskTemplateId,
            submission: task.submission,
        },
    });

    return newTask;
}

async function deleteTask(id: string, orgId: string): Promise<TaskDTO> {
    const existingTask = await prisma.task.findFirst({
        where: {
            id,
            assessment: {
                application: {
                    position: {
                        orgId,
                    },
                },
            },
        },
    });

    if (!existingTask) {
        throw new NotFoundException(`Task with id ${id} not found`);
    }

    const deletedTask = await prisma.task.delete({
        where: {
            id,
        },
    });

    return deletedTask;
}

async function updateTask(task: UpdateTaskDTO, orgId: string): Promise<TaskDTO> {
    const existingTask = await prisma.task.findFirst({
        where: {
            id: task.id,
            assessment: {
                application: {
                    position: {
                        orgId,
                    },
                },
            },
        },
    });

    if (!existingTask) {
        throw new NotFoundException(`Task with id ${task.id} not found`);
    }

    return await prisma.task.update({
        where: {
            id: task.id,
        },
        data: task,
    });
}

// Creates a Task when the candidate enters a question, or returns the existing
// in-flight Task if one exists for this (assessment, taskTemplate). Idempotent so
// re-mounts / refreshes don't fan out into duplicate rows. Fires the task-start
// META snapshot in the same transaction on first creation.
async function createForCandidate(assessmentId: string, taskTemplateId: string): Promise<Task> {
    const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        select: {
            id: true,
            submittedAt: true,
            assessmentTemplate: {
                select: {
                    tasks: { where: { taskTemplateId }, select: { taskTemplateId: true } },
                },
            },
        },
    });

    if (!assessment) {
        throw new NotFoundException('Assessment', assessmentId);
    }

    if (assessment.submittedAt) {
        throw new BadRequestException('Assessment has already been submitted');
    }

    if (assessment.assessmentTemplate.tasks.length === 0) {
        throw new BadRequestException(
            `Task template ${taskTemplateId} is not part of this assessment`
        );
    }

    const existing = await prisma.task.findFirst({
        where: { assessmentId, taskTemplateId, submittedAt: null },
        orderBy: { startedAt: 'desc' },
    });

    if (existing) return existing;

    return prisma.$transaction(async (tx) => {
        const task = await tx.task.create({
            data: { assessmentId, taskTemplateId },
        });

        await tx.snapshot.create({
            data: { taskId: task.id, type: SnapshotType.META },
        });

        return task;
    });
}

// Persists the candidate's submission for a task and fires the task-end META
// snapshot in the same transaction.
async function submitForCandidate(taskId: string, data: SubmitTaskForCandidateDTO): Promise<Task> {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { id: true, submittedAt: true },
    });

    if (!task) {
        throw new NotFoundException('Task', taskId);
    }

    if (task.submittedAt) {
        throw new BadRequestException('Task has already been submitted');
    }

    return prisma.$transaction(async (tx) => {
        const updated = await tx.task.update({
            where: { id: taskId },
            data: {
                submission: data.submission,
                passedTestCases: data.passedTestCases,
                failedTestCases: data.failedTestCases,
                submittedAt: new Date(),
            },
        });

        await tx.snapshot.create({
            data: { taskId, type: SnapshotType.META },
        });

        return updated;
    });
}

const taskService = {
    getTask,
    createTask,
    deleteTask,
    updateTask,
    createForCandidate,
    submitForCandidate,
};

export default taskService;
