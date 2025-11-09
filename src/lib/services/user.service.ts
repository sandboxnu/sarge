import { type User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type UserDTO } from '@/lib/schemas/user.schema';
import { NotFoundException } from '@/lib/utils/errors.utils';

async function deleteUser(userId: string): Promise<User> {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new NotFoundException('User', userId);
    }

    const deleted = await prisma.user.delete({
        where: {
            id: userId,
        },
    });
    return deleted;
}

async function getUser(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new NotFoundException('User', userId);
    }

    return user;
}

async function updateUser(userId: string, userData: Partial<UserDTO>): Promise<User> {
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!existingUser) {
        throw new NotFoundException('User', userId);
    }

    const updated = await prisma.user.update({
        where: {
            id: userId,
        },
        data: { ...userData, updatedAt: new Date() },
    });
    return updated;
}

const UserService = {
    deleteUser,
    getUser,
    updateUser,
};

export default UserService;
