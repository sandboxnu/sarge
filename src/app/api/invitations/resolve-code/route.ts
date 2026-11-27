import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';
import InvitationService from '@/lib/services/invitation.service';
import { handleError, UnauthorizedException } from '@/lib/utils/errors.utils';

const bodySchema = z.object({ code: z.string().min(1).max(32) });

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) throw new UnauthorizedException();

        const { code } = bodySchema.parse(await request.json().catch(() => null));
        const data = await InvitationService.resolveCodeForUser(code, session.user.email);

        return Response.json({ data }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
