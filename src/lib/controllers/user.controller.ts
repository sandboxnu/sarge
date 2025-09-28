import { Prisma, type User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
    type CreateUserDTO,
    createUserSchema,
    type UserDTO,
    UserNotFoundError,
} from '../schemas/user.schema';
import { InvalidUserInputError } from '../schemas/errors';
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
                throw new InvalidUserInputError();
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

    async get(userId: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new UserNotFoundError();
        }

        return user;
    }

    async update(userId: string, userData: Partial<UserDTO>): Promise<User> {
        try {
            const updatedUser = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: userData,
            });
            return updatedUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
                throw new UserNotFoundError();
            }
            throw error;
        }
    }
}
