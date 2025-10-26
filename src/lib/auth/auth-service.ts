'use server';

import { createSession, deleteSession, verifySession } from './auth';
import { redirect } from 'next/navigation';
import UserService from '../services/user.service';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import { AuthorizationError } from '../schemas/errors';
import { type User } from '@/generated/prisma';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { type SignupState } from '@/app/(web)/(auth)/signup/page';
import { type LoginState } from '@/app/(web)/(auth)/login/page';

export async function signup(
    prevState: SignupState | null,
    formData: FormData
): Promise<SignupState> {
    const parsedCreds = createUserSchema.safeParse({
        name: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsedCreds.success) {
        return {
            success: false,
            errors: parsedCreds.error.flatten().fieldErrors,
            message: 'Please check your input and try again.',
        };
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedCreds.data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: parsedCreds.data.name,
                email: parsedCreds.data.email,
                hashedPassword,
            },
        });

        await createSession({ userId: user.id, email: user.email });
    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            errors: {},
            message: 'There was an error creating your account. Please try again.',
        };
    }

    redirect('/dashboard');
}

export async function loginAction(
    prevState: LoginState | null,
    formData: FormData
): Promise<LoginState> {
    const parsedCreds = loginUserSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsedCreds.success) {
        return {
            success: false,
            errors: parsedCreds.error.flatten().fieldErrors,
            message: 'Please check your input and try again.',
        };
    }

    try {
        await login(parsedCreds.data);
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            errors: {},
            message: 'Invalid email or password. Please try again.',
        };
    }

    redirect('/dashboard');
}

export async function login(_credentials: { email: string; password: string }): Promise<User> {
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

    return await UserService.getUser(session.userId);
}
