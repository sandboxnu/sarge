import { Prisma, type User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateUserDTO, createUserSchema, UserNotFoundError } from '../schemas/user.schema';
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

    async delete(userId: string): Promise<User> {
        try {
            const deletedUser = await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
            return deletedUser;
        } catch (error) {
            // P2025 is for when the where clause fails because the instance does not exist in the DB
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
                throw new UserNotFoundError();
            }
            throw error;
        }
    }
}
