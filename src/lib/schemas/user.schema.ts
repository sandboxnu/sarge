import { z } from 'zod';

export class ValidationError extends Error {
    constructor(obj: unknown) {
        super(`The request structure is invalid. The server can't even parse the data.`);
    }
}

export const createUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
