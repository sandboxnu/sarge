import { z } from 'zod';

export const ConfirmBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        userId: z.string(),
        key: z.string(),
    }),
    z.object({
        type: z.literal('organization'),
        organizationId: z.string(),
        key: z.string(),
    }),
]);

export const SignBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        mime: z.string().min(3),
        userId: z.string(),
        organizationId: z.string().optional(),
    }),
    z.object({
        type: z.literal('organization'),
        mime: z.string().min(3),
        organizationId: z.string(),
        userId: z.string().optional(),
    }),
]);
