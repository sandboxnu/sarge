import CandidateService from '@/lib/services/candidate.service';
import { type NextRequest } from 'next/server';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { createCandidateSchema } from '@/lib/schemas/candidate.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createCandidateSchema.safeParse(body);
        if (!parsed.success) return badRequest('Invalid candidate data', parsed.error);

        const result = await CandidateService.createCandidate(parsed.data);
        if (!result.success) return error(result.message, result.status);
        return success(result.data, 201);
    } catch (err) {
        return handleError(err);
    }
}
