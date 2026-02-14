import ApplicationService from '@/lib/services/application.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { batchAddApplicationsSchema } from '@/lib/schemas/application.schema';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

/**
 * POST /api/positions/[id]/candidates/batch
 * Batch add candidate applications to a position (CSV upload flow)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const positionId = (await params).id;
        const body = await request.json();
        const parsed = batchAddApplicationsSchema.parse(body);

        const result = await ApplicationService.batchAddApplicationsToPosition(
            parsed.applications,
            positionId,
            session.activeOrganizationId
        );

        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
