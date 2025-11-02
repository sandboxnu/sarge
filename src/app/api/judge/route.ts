import { createBatchSubmission, getBatchSubmission } from '@/lib/connectors/judge0.connector';
import { error, handleError, success } from '@/lib/responses';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = await request.json();
        const run = await createBatchSubmission(response);
        if (!run.success) return Response.json(error(run.message, run.status));
        return Response.json(success(run.data, 201));
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(request: NextRequest) {
    try {
        const tokens = request.nextUrl.searchParams.getAll('tokens');
        const run = await getBatchSubmission(tokens);
        if (!run.success) return Response.json(error(run.message, run.status));
        return Response.json(success(run.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
