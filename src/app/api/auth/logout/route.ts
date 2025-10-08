import { type NextRequest } from 'next/server';
import { sargeApiResponse } from '@/lib/responses';
import { logout } from '@/lib/auth/auth-service';

export async function POST(_request: NextRequest) {
    try {
        await logout();
        return sargeApiResponse({ message: 'Logged out successfully' }, 200);
    } catch (error) {
        // Even if logout fails, we want to clear the session
        // This is a security best practice
        const message = error instanceof Error ? error.message : String(error);
        return sargeApiResponse({ message: 'Logged out', error: message }, 200);
    }
}
