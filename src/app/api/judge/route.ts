import { createBatchSubmission, getBatchSubmission } from '@/lib/connectors/judge0.connector';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const tokens = await createBatchSubmission(body);
        return Response.json({ data: tokens }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(request: NextRequest) {
    try {
        const tokens = request.nextUrl.searchParams.getAll('tokens');
        const results = await getBatchSubmission(tokens);
        return Response.json({ data: results }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
