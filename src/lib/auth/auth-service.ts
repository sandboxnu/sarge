import 'server-only';

import { createSession, deleteSession, verifySession } from './auth';
import { redirect } from 'next/navigation';
import { userController } from '../controllers/user.controller';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import { AuthorizationError } from '../schemas/errors';
import { type User } from '@/generated/prisma';

export interface LoginCredentials {
    email: string;
    password: string;
}

export async function login(_credentials: LoginCredentials): Promise<User> {
    const user = await prisma.user.findUnique({
        where: {
            email: _credentials.email,
        },
    });

    if (!user) {
        throw new AuthorizationError();
    }

    const isValidPassword = await bcrypt.compare(_credentials.password, user.hashedPassword);

    if (!isValidPassword) {
        throw new AuthorizationError();
    }

    await createSession({ userId: user.id, email: user.email });
    return user;
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}

export async function getCurrentUser() {
    const session = await verifySession();

    if (!session) {
        return null;
    }

    return await userController.get(session.userId);
}
