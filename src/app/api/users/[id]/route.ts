import UserService from '@/lib/services/user.service';
import { handleError } from '@/lib/utils/errors.utils';

import { type NextRequest } from 'next/server';
import { UserSchema } from '@/lib/schemas/user.schema';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await getSession();
        await assertRecruiterOrAbove(_request.headers);
        const result = await UserService.deleteUser((await params).id);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await getSession();
        const result = await UserService.getUser((await params).id);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await getSession();
        await assertRecruiterOrAbove(request.headers);
        const body = await request.json();
        const parsed = UserSchema.partial().parse(body);
        const result = await UserService.updateUser((await params).id, parsed);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
