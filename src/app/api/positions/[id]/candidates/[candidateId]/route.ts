import ApplicationService from '@/lib/services/application.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';

/**
 * DELETE /api/positions/[id]/candidates/[candidateId]
 * Remove a single application from a position
 * This will cascade delete their assessment if one exists
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string; candidateId: string }> }
) {
    try {
        const session = await getSession();
        const { id: positionId, candidateId } = await params;
        const result = await ApplicationService.removeApplicationFromPosition(
            candidateId,
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
