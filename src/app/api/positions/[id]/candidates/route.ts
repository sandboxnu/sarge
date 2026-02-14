import ApplicationService from '@/lib/services/application.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { addApplicationWithCandidateDataSchema } from '@/lib/schemas/application.schema';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

/**
 * POST /api/positions/[id]/candidates
 * Add a single candidate to a position (create candidate if not exists)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const positionId = (await params).id;
        const body = await request.json();
        const parsed = addApplicationWithCandidateDataSchema.parse(body);
        const result = await ApplicationService.addApplicationToPosition(
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
 * GET /api/positions/[id]/candidates
 * Get all a position's applications' candidates
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(_request.headers);
        const positionId = (await params).id;
        const result = await ApplicationService.getPositionApplications(
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

/**
 * DELETE /api/positions/[id]/candidates
 * Remove ALL candidates from a position
 */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(_request.headers);
        const positionId = (await params).id;
        const result = await ApplicationService.removeAllApplicationsFromPosition(
            positionId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 204 });
    } catch (err) {
        return handleError(err);
    }
}
