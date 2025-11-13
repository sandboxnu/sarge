import PositionService from '@/lib/services/position.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { createPositionSchema } from '@/lib/schemas/position.schema';
import { getSession } from '@/lib/utils/auth.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        const body = await request.json();
        const parsed = createPositionSchema.parse(body);
        const result = await PositionService.createPosition(
            parsed,
            session.userId,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
