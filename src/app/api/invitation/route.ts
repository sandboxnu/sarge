import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) throw new Error('missing id');

        const invitation = await prisma.invitation.findUnique({
            where: { id },
            select: {
                id: true,
                organizationId: true,
                email: true,
                role: true,
                status: true,
                expiresAt: true,
            },
        });

        return Response.json({ data: invitation }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
