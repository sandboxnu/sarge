import UserService from '@/lib/services/user.service';
import { type NextRequest } from 'next/server';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { createUserSchema } from '@/lib/schemas/user.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createUserSchema.safeParse(body);
        if (!parsed.success) return Response.json(badRequest('Invalid user data', parsed.error));

        const result = await UserService.createUser(parsed.data);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 201));
    } catch (err) {
        return handleError(err);
    }
}
