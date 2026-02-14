import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { createPositionSchema } from '@/lib/schemas/position.schema';
import PositionService from '@/lib/services/position.service';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
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
