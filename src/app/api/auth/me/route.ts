import { type NextRequest } from 'next/server';
import { success, handleError, unAuthenticated } from '@/lib/responses';
import { getCurrentUser } from '@/lib/auth/auth-service';

export async function GET(_request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return Response.json(unAuthenticated('Not authenticated'));
        }

        return Response.json(success(user, 200));
    } catch (err) {
        return handleError(err);
    }
}
