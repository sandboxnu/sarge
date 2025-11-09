import { z } from 'zod';
import { RoleType } from '@/generated/prisma';

export const RoleEnum = z.enum([RoleType.ADMIN, RoleType.RECRUITER, RoleType.REVIEWER] as const);

export const RoleSchema = z.object({
    role: RoleEnum,
});

export type RoleDTO = z.infer<typeof RoleSchema>;
