import { createCandidate } from '@/lib/services/candidate.service';
import { type NextRequest } from 'next/server';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const candidate = await createCandidate(body);
        return sargeApiResponse(candidate, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
