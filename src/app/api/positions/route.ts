import { type NextRequest } from 'next/server';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { createPositionSchema } from '@/lib/schemas/position.schema';
import PositionService from '@/lib/services/position.service';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const body = await request.json();
        const parsed = createPositionSchema.parse(body);

        const position = await PositionService.createPosition(
            parsed,
            session.userId,
            session.activeOrganizationId
        );

        return Response.json({ data: position }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(_req: NextRequest) {
    try {
        const session = await getSession();
        const positions = await PositionService.getPositionsByOrgId(session.activeOrganizationId);

        return Response.json({ data: positions }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
