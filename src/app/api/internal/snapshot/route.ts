import snapshotService from '@/lib/services/snapshot.service';
import { handleError, UnauthorizedException } from '@/lib/utils/errors.utils';
import { CreateDisconnectSnapshotSchema } from '@/lib/schemas/snapshot.schema';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const expected = process.env.INTERNAL_API_SECRET;
        const provided = request.headers.get('X-SARGE-INTERNAL-SECRET');
        if (!expected || provided !== expected) {
            throw new UnauthorizedException('Invalid internal secret');
        }

        const body = await request.json();
        const { candidateEmail } = CreateDisconnectSnapshotSchema.parse(body);
        const snapshot = await snapshotService.createDisconnectSnapshot(candidateEmail);
        return Response.json({ data: snapshot }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
