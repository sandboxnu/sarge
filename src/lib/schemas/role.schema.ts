import { z } from 'zod';

export const updateRoleSchema = z.object({
    role: z.enum(['admin', 'recruiter', 'reviewer', 'member']),
});

export type UpdateInvitationRolePayload = z.infer<typeof updateRoleSchema>;
