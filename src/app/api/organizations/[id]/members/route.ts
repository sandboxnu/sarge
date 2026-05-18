import { type NextRequest } from 'next/server';
import InvitationService from '@/lib/services/invitation.service';
import MemberService from '@/lib/services/member.service';
import { handleError } from '@/lib/utils/errors.utils';
import { assertAdminOrOwner } from '@/lib/utils/permissions.utils';
import type { OrgMembersAndInvitations } from '@/lib/types/invitation.types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await assertAdminOrOwner(request.headers);

        const { id: organizationId } = await params;

        const members = await MemberService.listMembersWithUsers(organizationId);

        const invitations =
            await InvitationService.listPendingInvitationsForOrganization(organizationId);

        const data: OrgMembersAndInvitations = {
            members,
            invitations,
        };

        return Response.json({ data }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
