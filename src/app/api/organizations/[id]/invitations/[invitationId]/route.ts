import { type NextRequest } from 'next/server';
import InvitationService from '@/lib/services/invitation.service';
import { updateRoleSchema } from '@/lib/schemas/role.schema';
import { handleError } from '@/lib/utils/errors.utils';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
    try {
        const { id: organizationId, invitationId } = await params;
        const body = await request.json();
        const { role } = updateRoleSchema.parse(body);

        const updated = await InvitationService.updatePendingInvitationRole(
            organizationId,
            invitationId,
            role,
            request.headers
        );

        return Response.json({ data: updated }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
    try {
        const { id: organizationId, invitationId } = await params;

        await InvitationService.deletePendingInvitation(
            organizationId,
            invitationId,
            request.headers
        );

        return new Response(null, { status: 204 });
    } catch (err) {
        return handleError(err);
    }
}
