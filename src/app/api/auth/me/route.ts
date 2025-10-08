import { type NextRequest } from 'next/server';
import { sargeApiResponse, sargeApiError } from '@/lib/responses';
import { getCurrentUser } from '@/lib/auth/auth-service';

export async function GET(_request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return sargeApiError('Not authenticated', 401);
        }

        return sargeApiResponse(user, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
