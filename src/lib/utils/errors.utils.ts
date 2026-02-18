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
        super(401, `Unauthorized: ${message ? `: ${message}` : '!'}`);
    }
}

/**
 * Exception for forbidden access (insufficient permissions)
 */
export class ForbiddenException extends HttpException {
    constructor(message?: string) {
        super(403, `Access Denied: ${message ? `: ${message}` : '!'}`);
    }
}

/**
 * Exception for internal server errors
 */
export class InternalServerException extends HttpException {
    constructor(message?: string) {
        super(500, `Internal Server Error: ${message ? `: ${message}` : '!'}`);
    }
}

// We need this because Prisma errors instsanceof is not reliable at runtime
type PrismaKnownErrorLike = {
    code: string;
    meta?: { target?: unknown };
    name?: string;
};

function isPrismaKnownError(err: unknown): err is PrismaKnownErrorLike {
    if (!err || typeof err !== 'object') return false;
    if (!('code' in err)) return false;
    return typeof (err as { code?: unknown }).code === 'string';
}

function getPrismaTargetStrings(target: unknown): string[] {
    if (Array.isArray(target)) return target.map((t) => String(t));
    if (typeof target === 'string') return [target];
    return [];
}

function formatPrismaP2002Message(err: PrismaKnownErrorLike): string {
    const targets = getPrismaTargetStrings(err.meta?.target);
    const targetText = targets.join(' ');

    const duplicateApplication =
        (targets.includes('candidateId') && targets.includes('positionId')) ||
        (targetText.includes('candidateId') && targetText.includes('positionId')) ||
        targetText.includes('Application_candidateId_positionId_key');

    if (duplicateApplication) {
        return 'This candidate is already added to this position.';
    }

    const duplicateCandidateByEmailOrg =
        (targets.includes('email') && targets.includes('orgId')) ||
        targetText.includes('Candidate_email_orgId_key');

    if (duplicateCandidateByEmailOrg) {
        return 'A candidate with this email already exists in your organization.';
    }

    return 'A record with the same unique fields already exists.';
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

    if (isPrismaKnownError(err)) {
        if (err.code === 'P2002') {
            return Response.json(
                {
                    message: formatPrismaP2002Message(err),
                    data: null,
                    debug:
                        process.env.NODE_ENV === 'development'
                            ? {
                                  errorName: err.name,
                                  errorCode: err.code,
                                  errorMeta: err.meta,
                              }
                            : undefined,
                },
                { status: 409 }
            );
        }

        if (err.code === 'P2025') {
            return Response.json(
                {
                    message: 'The requested record could not be found.',
                    data: null,
                    debug:
                        process.env.NODE_ENV === 'development'
                            ? {
                                  errorName: err.name,
                                  errorCode: err.code,
                                  errorMeta: err.meta,
                              }
                            : undefined,
                },
                { status: 404 }
            );
        }

        if (err.code === 'P2003') {
            return Response.json(
                {
                    message: 'This item is currently in use and cannot be deleted.',
                    data: null,
                    debug:
                        process.env.NODE_ENV === 'development'
                            ? {
                                  errorName: err.name,
                                  errorCode: err.code,
                                  errorMeta: err.meta,
                              }
                            : undefined,
                },
                { status: 409 }
            );
        }
    }

    if (err instanceof z.ZodError) {
        const { fieldErrors }: { fieldErrors: Record<string, string[]> } = z.flattenError(err);

        const formatted = Object.entries(fieldErrors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');

        return Response.json(
            {
                message: formatted,
                data: null,
            },
            { status: 400 }
        );
    }

    if (err instanceof Error) {
        return Response.json(
            {
                message: err.message,
                data: null,
                debug:
                    process.env.NODE_ENV === 'development'
                        ? {
                              errorName: err.name,
                              errorStack: err.stack,
                          }
                        : undefined,
            },
            { status: 500 }
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
