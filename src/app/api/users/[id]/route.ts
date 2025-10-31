import UserService from '@/lib/services/user.service';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { type NextRequest } from 'next/server';
import { UserSchema } from '@/lib/schemas/user.schema';

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const result = await UserService.deleteUser((await params).id);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const result = await UserService.getUser((await params).id);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const parsed = UserSchema.partial().safeParse(body);
        if (!parsed.success) return Response.json(badRequest('Invalid user data', parsed.error));

        const result = await UserService.updateUser((await params).id, parsed.data);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
