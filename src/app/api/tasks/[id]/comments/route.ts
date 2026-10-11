import { type NextRequest } from 'next/server';
import { CreateCommentSchema } from '@/lib/schemas/task.schema';
import taskService from '@/lib/services/task.service';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertOrgPermission } from '@/lib/utils/permissions.utils';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertOrgPermission(request.headers, { comment: ['create'] });
        const { id } = await params;
        const parsed = CreateCommentSchema.parse(await request.json());
        const result = await taskService.createComment(
            id,
            session.userId,
            parsed,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
