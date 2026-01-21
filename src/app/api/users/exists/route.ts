import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('email')?.trim().toLowerCase();

        if (!email) {
            return new Response(JSON.stringify({ exists: false }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        return new Response(JSON.stringify({ exists: user }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ exists: false }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
