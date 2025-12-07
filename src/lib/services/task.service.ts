import { prisma } from '@/lib/prisma';
import type { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '@/lib/schemas/task.schema';
import { NotFoundException } from '@/lib/utils/errors.utils';

async function getTask(id: string): Promise<TaskDTO> {
    const foundTask = await prisma.task.findUnique({
        where: {
            id,
        },
    });

    if (!foundTask) {
        throw new NotFoundException(`Task with id ${id} not found`);
    }

    return foundTask;
}

async function createTask(task: CreateTaskDTO): Promise<TaskDTO> {
    const assessment = await prisma.assessment.findUnique({
        where: {
            id: task.assessmentId,
        },
    });

    if (!assessment) {
        throw new NotFoundException(`Assessment with id ${task.assessmentId} not found`);
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

async function deleteTask(id: string): Promise<TaskDTO> {
    const existingTask = await prisma.task.findUnique({
        where: { id },
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

async function updateTask(task: UpdateTaskDTO): Promise<TaskDTO> {
    const existingTask = await prisma.task.findUnique({
        where: {
            id: task.id,
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
