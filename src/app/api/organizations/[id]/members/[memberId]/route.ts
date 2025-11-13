import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { updateRoleSchema } from '@/lib/schemas/role.schema';
import MemberService from '@/lib/services/member.service';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; memberId: string }> }
) {
    try {
        const { id: orgId, memberId: memberIdToUpdate } = await params;

        const body = await request.json();
        const { role } = updateRoleSchema.parse(body);

        const updatedMember = await MemberService.updateMemberRole(memberIdToUpdate, role, orgId);

        return Response.json({ data: updatedMember }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
