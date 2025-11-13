import { z } from 'zod';

export class HttpException extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}

/**
 * Exception for resources that are not found
 */
export class NotFoundException extends HttpException {
    constructor(resource: string, identifier?: string | number) {
        const message = `${resource} with ID ${identifier} not found`;
        super(404, message);
    }
}

/**
 * Exception for resources that conflict (e.g., duplicate names)
 */
export class ConflictException extends HttpException {
    constructor(resource: string, detail: string) {
        const message = `${resource} ${detail} already exists`;
        super(409, message);
    }
}

/**
 * Exception for bad request (validation errors or other bad requests)
 */
export class BadRequestException extends HttpException {
    constructor(
        message: string,
        public readonly fieldErrors?: Record<string, string[]>
    ) {
        super(400, message);
    }
}

/**
 * Exception for unauthorized access (authentication error)
 */
export class UnauthorizedException extends HttpException {
    constructor(message?: string) {
        super(401, `Unauthorized${message ? `: ${message}` : '!'}`);
    }
}

/**
 * Exception for forbidden access (insufficient permissions)
 */
export class ForbiddenException extends HttpException {
    constructor(message?: string) {
        super(403, `Access Denied ${message ? `: ${message}` : '!'}`);
    }
}

/**
 * Exception for internal server errors
 */
export class InternalServerException extends HttpException {
    constructor(message?: string) {
        super(500, `Internal Server Error${message ? `: ${message}` : '!'}`);
    }
}

export function handleError(err: unknown): Response {
    if (err instanceof HttpException) {
        return Response.json(
            {
                message: err.message,
                data: null,
            },
            { status: err.status }
        );
    }

    if (err instanceof z.ZodError) {
        const { fieldErrors }: { fieldErrors: Record<string, string[]> } = z.flattenError(err);
        return Response.json(
            {
                message: fieldErrors,
                data: null,
            },
            { status: 400 }
        );
    }

    return Response.json(
        {
            message: 'Ermm... I think Winston ate your request?',
            data: null,
        },
        { status: 500 }
    );
}
