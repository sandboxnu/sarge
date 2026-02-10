import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithoutOrg } from '@/lib/utils/auth.utils';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

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

        if (!invitation) return NextResponse.json({ error: 'not found' }, { status: 404 });
        return NextResponse.json(invitation);
    } catch {
        return NextResponse.json({ error: 'server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
        const session = await getSessionWithoutOrg();

        const invitation = await prisma.invitation.findUnique({ where: { id } });
        if (!invitation) return NextResponse.json({ error: 'not found' }, { status: 404 });

        const now = new Date();
        const [updatedInvitation, member] = await prisma.$transaction([
            prisma.invitation.update({
                where: { id },
                data: { status: 'ACCEPTED', acceptedAt: now },
            }),
            prisma.member.upsert({
                where: {
                    userId_organizationId: {
                        userId: session.userId,
                        organizationId: invitation.organizationId,
                    },
                },
                create: {
                    userId: session.userId,
                    organizationId: invitation.organizationId,
                    role: invitation.role,
                },
                update: { role: invitation.role },
            }),
        ]);

        return NextResponse.json({
            ok: true,
            invitation: { id: updatedInvitation.id, status: updatedInvitation.status },
            member,
        });
    } catch {
        return NextResponse.json({ error: 'server error' }, { status: 500 });
    }
}
