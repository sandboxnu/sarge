import { CandidateController } from '@/lib/controllers/candidate.controller';
import { type NextRequest } from 'next/server';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';

const candidateController = new CandidateController();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const candidate = await candidateController.create(body);
        return sargeApiResponse(candidate, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}
