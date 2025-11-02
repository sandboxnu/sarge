import { type User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateUserDTO, type UserDTO } from '@/lib/schemas/user.schema';
import { type Result, notFound, success } from '@/lib/responses';

async function createUser(user: CreateUserDTO): Promise<Result<User>> {
    const created = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            hashedPassword: user.password,
        },
    });
    return success(created, 201);
}

async function deleteUser(userId: string): Promise<Result<User>> {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        return notFound('User', userId);
    }

    const deleted = await prisma.user.delete({
        where: {
            id: userId,
        },
    });
    return success(deleted, 200);
}

async function getUser(userId: string): Promise<Result<User>> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            organization: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!user) {
        return notFound('User', userId);
    }

    return success(user, 200);
}

async function updateUser(userId: string, userData: Partial<UserDTO>): Promise<Result<User>> {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        return notFound('User', userId);
    }

    const updated = await prisma.user.update({
        where: {
            id: userId,
        },
        data: { ...userData, updatedAt: new Date() },
    });
    return success(updated, 200);
}

const UserService = {
    createUser,
    deleteUser,
    getUser,
    updateUser,
};

export default UserService;
