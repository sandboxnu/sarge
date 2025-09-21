import { type User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateUserDTO, createUserSchema } from '../schemas/user.schema';
import { ValidationError } from '../schemas/errors';
import z from 'zod';

export class UserController {
    async create(user: CreateUserDTO): Promise<User> {
        try {
            const validatedUser = createUserSchema.parse(user);
            return await prisma.user.create({
                data: validatedUser,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError();
            }
            throw error;
        }
    }
}
