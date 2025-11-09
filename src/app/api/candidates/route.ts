import CandidateService from '@/lib/services/candidate.service';
import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { createCandidateSchema } from '@/lib/schemas/candidate.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createCandidateSchema.parse(body);
        const result = await CandidateService.createCandidate(parsed);
        return Response.json({ success: true, data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
