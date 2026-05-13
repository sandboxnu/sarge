import { type NextRequest } from 'next/server';
import InvitationService from '@/lib/services/invitation.service';
import MemberService from '@/lib/services/member.service';
import { handleError } from '@/lib/utils/errors.utils';
import type { OrgMembersAndInvitations } from '@/lib/types/invitation.types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: organizationId } = await params;

        const members = await MemberService.listMembersWithUsers(
            organizationId,
            request.headers
        );

        const invitations = await InvitationService.listPendingInvitationsForOrganization(
            organizationId,
            request.headers
        );

        const data: OrgMembersAndInvitations = {
            members,
            invitations,
        };

        return Response.json({ data }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
