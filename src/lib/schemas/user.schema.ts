import { z } from 'zod';

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
    password: z.string().min(8),
});

export const loginUserSchema = z.object({
    email: createUserSchema.shape.email,
    password: z.string().min(8, 'Password is required'),
});

export const UserSchema = z.object({
    id: z.uuid(),
    orgId: z.uuid().optional(),
    name: createUserSchema.shape.name,
    email: createUserSchema.shape.email,
});

export type UserDTO = z.infer<typeof UserSchema>;

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export type LoginUserDTO = z.infer<typeof loginUserSchema>;
