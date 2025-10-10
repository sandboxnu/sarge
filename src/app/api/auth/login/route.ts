import { type NextRequest } from 'next/server';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { login } from '@/lib/auth/auth-service';
import { InvalidInputError } from '@/lib/schemas/errors';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.email || !body.password) {
            return sargeApiError('Email and password are required', 400);
        }

        const user = await login({
            email: body.email,
            password: body.password,
        });

        return sargeApiResponse(user, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);

        if (message.includes('Invalid credentials')) {
            return sargeApiError('Invalid email or password', 401);
        }

        if (message.includes('Login implementation needed')) {
            return sargeApiError('Authentication not yet configured', 501);
        }

        return sargeApiError(message, 500);
    }
}
