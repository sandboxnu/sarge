import { prisma } from '@/lib/prisma';
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '@/lib/schemas/task.schema';
import { NotFoundException } from '@/lib/utils/errors.utils';

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
            candidateCode: task.candidateCode,
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

const taskService = {
    getTask,
    createTask,
    deleteTask,
    updateTask,
};

export default taskService;
