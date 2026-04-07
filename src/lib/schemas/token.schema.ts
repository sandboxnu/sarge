import z from 'zod';

export const GenerateOATokenSchema = z.object({
    email: z.email(),
});
