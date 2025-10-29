import { type NextRequest } from 'next/server';
import { handleError, success } from '@/lib/responses';
import { logout } from '@/lib/auth/auth-service';
import { deleteSession } from '@/lib/auth/auth';

export async function POST(_request: NextRequest) {
    try {
        await logout();
        await deleteSession();
        return Response.json(success({ message: 'Logged out successfully' }, 200));
    } catch (err) {
        return handleError(err);
    }
}
