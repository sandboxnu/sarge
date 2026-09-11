import ApplicationService from '@/lib/services/application.service';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const orgId = session.activeOrganizationId;
        const { id: positionId } = await params;

        const searchParams = request.nextUrl.searchParams;

        const name = searchParams.get('name');

        if (!name) {
            const applications = await ApplicationService.getPositionApplications(
                positionId,
                orgId
            );
            return Response.json({ data: applications }, { status: 200 });
        }

        const applications = await ApplicationService.getApplicationsByName(orgId, name);
        return Response.json({ data: applications }, { status: 200 });
    } catch (err) {
        handleError(err);
    }
}
