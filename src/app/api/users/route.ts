import { UserController } from '@/lib/controllers/user.controller';
import { type NextRequest } from 'next/server';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';

const userController = new UserController();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await userController.create(body);
        return sargeApiResponse(user, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
