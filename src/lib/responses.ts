import { Prisma } from '@/generated/prisma';
import { type ZodError } from 'zod';
import { z } from 'zod';

export interface Result<T> {
    success: boolean;
    message: string;
    data: T | null;
    status: number;
}

export function success<T>(data: T, status = 200, message?: string) {
    return { success: true, message: message ?? 'Success', data, status };
}

export function error(message: string = 'Internal server error', status = 500) {
    return { success: false, message, data: null, status };
}

export function badRequest(message: string, zodError?: ZodError) {
    const status = 400;

    if (zodError) {
        const { fieldErrors } = z.flattenError(zodError);
        return { success: false, message, data: fieldErrors as Record<string, string[]>, status };
    }

    return { success: false, message, data: null, status };
}

export function unAuthenticated(message: string = 'Unauthorized') {
    const status = 401;
    return { success: false, message, data: null, status };
}

export function forbidden(message: string = 'Permission denied') {
    const status = 403;
    return { success: false, message, data: null, status };
}

export function notFound(resource: string, identifier?: string) {
    const status = 404;
    const message = identifier
        ? `${resource} with ID ${identifier} not found`
        : `${resource} not found`;
    return { success: false, message, data: null, status };
}

export function conflict(resource: string, detail?: string) {
    const status = 409;
    const message = detail ? `${resource} ${detail} already exists` : `${resource} already exists`;
    return { success: false, message, data: null, status };
}

export function handleError(err: unknown) {
    const status = 500;
    let message = 'Internal server error';

    if (err instanceof z.ZodError) {
        return badRequest('Invalid data', err);
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return notFound('Resource not found', err.message);
    }

    if (err instanceof Error) {
        message = err.message;
    } else if (typeof err === 'string') {
        message = err;
    }

    return error(message, status);
}
