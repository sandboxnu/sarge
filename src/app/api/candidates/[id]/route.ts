import CandidateService from '@/lib/services/candidate.service';
import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { updateCandidateSchema } from '@/lib/schemas/candidate.schema';

/**
 * PUT /api/candidates/[id]
 * Update candidate information
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const candidateId = (await params).id;
        const body = await request.json();
        const parsed = updateCandidateSchema.parse(body);
        const result = await CandidateService.updateCandidate(candidateId, parsed);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
