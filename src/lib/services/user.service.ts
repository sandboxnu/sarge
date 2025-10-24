import { Prisma, type User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
    type CreateUserDTO,
    createUserSchema,
    type UserDTO,
    UserNotFoundError,
    UserSchema,
} from '../schemas/user.schema';
import { InvalidInputError } from '../schemas/errors';
import z from 'zod';

export async function createUser(user: CreateUserDTO): Promise<User> {
    try {
        const validatedUser = createUserSchema.parse(user);
        return await prisma.user.create({
            data: {
                name: validatedUser.name,
                email: validatedUser.email,
                hashedPassword: validatedUser.password,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new InvalidInputError();
        }
        throw error;
    }
}

export async function deleteUser(userId: string): Promise<User> {
    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        return deletedUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
            throw new UserNotFoundError();
        }
        throw error;
    }
}

export async function getUser(userId: string): Promise<User> {
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

export async function updateUser(userId: string, userData: Partial<UserDTO>): Promise<User> {
    try {
        const validatedUser = UserSchema.partial().parse(userData);
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: { ...validatedUser, updatedAt: new Date() },
        });
        return updatedUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2025') {
            throw new UserNotFoundError();
        }
        throw error;
    }
}
