import { z } from 'zod';

export class UserNotFoundError extends Error {
    constructor() {
        super('User Not Found');
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
    hashedPassword: z.string(),
});

export const UserSchema = z.object({
    id: z.uuid(),
    orgId: z.uuid().optional(),
    name: createUserSchema.shape.name,
    email: createUserSchema.shape.email,
});

export type UserDTO = z.infer<typeof UserSchema>;

export type CreateUserDTO = z.infer<typeof createUserSchema>;
