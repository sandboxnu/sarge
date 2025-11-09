import { z } from 'zod';

export const ConfirmBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        userId: z.cuid(),
        key: z.string(),
    }),
    z.object({
        type: z.literal('organization'),
        organizationId: z.cuid(),
        key: z.string(),
    }),
]);

export const SignBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        mime: z.string().min(3),
        userId: z.cuid(),
        organizationId: z.cuid().optional(),
    }),
    z.object({
        type: z.literal('organization'),
        mime: z.string().min(3),
        organizationId: z.cuid(),
        userId: z.cuid().optional(),
    }),
]);
