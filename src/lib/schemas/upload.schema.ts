import { z } from 'zod';

export const ConfirmBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        userId: z.uuid(),
        key: z.string(),
    }),
    z.object({
        type: z.literal('organization'),
        organizationId: z.uuid(),
        key: z.string(),
    }),
]);

export const SignBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        mime: z.string().min(3),
        userId: z.uuid(),
        organizationId: z.uuid().optional(),
    }),
    z.object({
        type: z.literal('organization'),
        mime: z.string().min(3),
        organizationId: z.uuid(),
        userId: z.uuid().optional(),
    }),
]);
