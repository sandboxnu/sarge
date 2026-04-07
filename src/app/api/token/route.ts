import { GenerateOATokenSchema } from '@/lib/schemas/token.schema';
import { handleError } from '@/lib/utils/errors.utils';
import { generateToken } from '@/lib/utils/token.utils';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // TODO: add route security
        const body = await request.json();
        const parsed = GenerateOATokenSchema.parse(body);
        const token = await generateToken(parsed.email);

        return Response.json({ data: token }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
