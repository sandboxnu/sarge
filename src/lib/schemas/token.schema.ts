import z from 'zod';

export const TokenSchema = z.object({
    email: z.email(),
});
