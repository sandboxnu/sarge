import { type NextRequest } from 'next/server';
import { sargeApiResponse } from '@/lib/responses';
import { logout } from '@/lib/auth/auth-service';

export async function POST(_request: NextRequest) {
    try {
        await logout();
        return sargeApiResponse({ message: 'Logged out successfully' }, 200);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return sargeApiResponse({ message: 'Logged out', error: message }, 200);
    }
}
