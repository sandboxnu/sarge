import judge0Connector from '@/lib/connectors/judge0.connector';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';

export async function POST(request: NextRequest) {
    try {
        await getSession();
        const body = await request.json();
        const tokens = await judge0Connector.createBatchSubmission(body);
        return Response.json({ data: tokens }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(request: NextRequest) {
    try {
        await getSession();
        const tokens = request.nextUrl.searchParams.getAll('tokens');
        const results = await judge0Connector.getBatchSubmission(tokens);
        return Response.json({ data: results }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
