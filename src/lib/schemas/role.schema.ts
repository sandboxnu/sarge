import { z } from 'zod';

export const updateRoleSchema = z.object({
    role: z.enum(['owner', 'admin', 'member', 'recruiter', 'reviewer']),
});
