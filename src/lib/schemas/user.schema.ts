import { z } from 'zod';

export const createUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters'),
});

export const loginUserSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
});

export const UserSchema = z.object({
    id: z.string(),
    name: createUserSchema.shape.name,
    email: createUserSchema.shape.email,
});

export const updateProfileSchema = UserSchema.pick({ name: true, email: true });

export const requestPasswordResetSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .toLowerCase()
        .trim()
        .max(255, 'Email must be less than 255 characters'),
});

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(128, 'Password must be less than 128 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type UserDTO = z.infer<typeof UserSchema>;

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export type LoginUserDTO = z.infer<typeof loginUserSchema>;

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;

export type RequestPasswordResetDTO = z.infer<typeof requestPasswordResetSchema>;

export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
