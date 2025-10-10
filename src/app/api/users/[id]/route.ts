import { userController } from '@/lib/controllers/user.controller';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { UserNotFoundError } from '@/lib/schemas/user.schema';
import { type NextRequest } from 'next/server';

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const user = await userController.delete(id);
        return sargeApiResponse(user, 200);
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const user = await userController.get(id);
        return sargeApiResponse(user, 200);
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const body = await request.json();
        const user = await userController.update(id, body);
        return sargeApiResponse(user, 200);
    } catch (error) {
        if (error instanceof UserNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
