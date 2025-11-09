import PositionService from '@/lib/services/position.service';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';
import { CreatePositionSchema } from '@/lib/schemas/position.schema';
import { getSession } from '@/lib/utils/auth.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const userId = session.userId;
        const orgId = session.activeOrganizationId;

        const body = await request.json();
        const parsed = CreatePositionSchema.parse(body);
        const result = await PositionService.createPosition(parsed, userId, orgId);
        return Response.json({ success: true, data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
