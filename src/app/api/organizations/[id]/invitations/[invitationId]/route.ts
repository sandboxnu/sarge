import { type NextRequest } from 'next/server';
import InvitationService from '@/lib/services/invitation.service';
import { updateRoleSchema } from '@/lib/schemas/role.schema';
import { handleError } from '@/lib/utils/errors.utils';
import { assertAdminOrOwner } from '@/lib/utils/permissions.utils';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
    try {
        await assertAdminOrOwner(request.headers);

        const { id: organizationId, invitationId } = await params;
        const body = await request.json();
        const { role } = updateRoleSchema.parse(body);

        const updated = await InvitationService.updatePendingInvitationRole(
            organizationId,
            invitationId,
            role
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
        await assertAdminOrOwner(request.headers);

        const { id: organizationId, invitationId } = await params;

        await InvitationService.deletePendingInvitation(organizationId, invitationId);

        return new Response(null, { status: 204 });
    } catch (err) {
        return handleError(err);
    }
}
