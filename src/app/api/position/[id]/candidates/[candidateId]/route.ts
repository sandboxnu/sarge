import CandidatePoolService from '@/lib/services/candidate-pool.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';

/**
 * DELETE /api/position/[id]/candidates/[candidateId]
 * Remove a single candidate from a position's pool
 * This will cascade delete their assessment if one exists
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string; candidateId: string }> }
) {
    try {
        const session = await getSession();
        const { id: positionId, candidateId } = await params;
        const result = await CandidatePoolService.removeCandidateFromPosition(
            candidateId,
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
