import { type NextRequest } from 'next/server';
import { BadRequestException, ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { createPositionSchema } from '@/lib/schemas/position.schema';
import PositionService from '@/lib/services/position.service';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
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

export async function GET(request: NextRequest) {
    try {
        const orgId = request.nextUrl.searchParams.get('orgId');

        if (!orgId) {
            throw new BadRequestException('orgId is required');
        }

        const session = await getSession();

        if (session.activeOrganizationId !== orgId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }

        const positions = await PositionService.getPositionsByOrgId(orgId);

        return Response.json({ data: positions }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
