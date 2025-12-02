import CandidatePoolService from '@/lib/services/candidate-pool.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { addCandidateWithDataSchema } from '@/lib/schemas/candidate-pool.schema';

/**
 * POST /api/position/[id]/candidates
 * Add a single candidate to a position (create candidate if not exists)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const positionId = (await params).id;
        const body = await request.json();
        const parsed = addCandidateWithDataSchema.parse(body);

        const result = await CandidatePoolService.addCandidateToPosition(
            parsed,
            positionId,
            session.activeOrganizationId
        );

        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}

/**
 * GET /api/position/[id]/candidates
 * Get all candidates in a position's pool
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const positionId = (await params).id;
        const result = await CandidatePoolService.getPositionCandidates(
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

/**
 * DELETE /api/position/[id]/candidates
 * Remove ALL candidates from a position
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        const positionId = (await params).id;
        const result = await CandidatePoolService.removeAllCandidatesFromPosition(
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 204 });
    } catch (err) {
        return handleError(err);
    }
}
