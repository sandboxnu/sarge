import { type NextRequest } from 'next/server';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { updateRoleSchema } from '@/lib/schemas/role.schema';
import MemberService from '@/lib/services/member.service';
import { getSession } from '@/lib/utils/auth.utils';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; memberId: string }> }
) {
    try {
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const { id: orgId, memberId: memberIdToUpdate } = await params;
        if (session.activeOrganizationId !== orgId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }

        const body = await request.json();
        const { role } = updateRoleSchema.parse(body);

        const updatedMember = await MemberService.updateMemberRole(
            memberIdToUpdate,
            role,
            orgId,
            request.headers
        );

        return Response.json({ data: updatedMember }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
