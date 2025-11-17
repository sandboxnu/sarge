import CandidatePoolService from '@/lib/services/candidate-pool.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { batchAddCandidatesSchema } from '@/lib/schemas/candidate-pool.schema';

/**
 * POST /api/position/[id]/candidates/batch
 * Batch add candidates to a position (CSV upload flow)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const positionId = (await params).id;
        const body = await request.json();
        const parsed = batchAddCandidatesSchema.parse(body);

        const result = await CandidatePoolService.batchAddCandidatesToPosition(
            parsed.candidates,
            positionId,
            session.activeOrganizationId
        );

        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
