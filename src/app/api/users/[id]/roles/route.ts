import { success, badRequest, unAuthenticated, error, handleError } from '@/lib/responses';
import { type NextRequest } from 'next/server';
import { RoleSchema } from '@/lib/schemas/role.schema';
import RoleService from '@/lib/services/role.service';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const result = await RoleService.getUserRole((await params).id);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const assignedUserId = (await params).id;
        const body = await request.json();
        const assigningUserId = (body as { userId?: string }).userId;

        if (!assigningUserId) return Response.json(unAuthenticated('User not authenticated'));

        const parsed = RoleSchema.safeParse(body);
        if (!parsed.success) return Response.json(badRequest('Invalid role', parsed.error));

        const result = await RoleService.assignRole(
            assignedUserId,
            assigningUserId,
            parsed.data.role
        );
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
