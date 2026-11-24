import { type NextRequest } from 'next/server';
import InvitationService from '@/lib/services/invitation.service';

// Public (invitee may not have an account). Always 200 so it reveals nothing about the id.
export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> }
) {
    const { invitationId } = await params;
    try {
        await InvitationService.resendPendingInvitation(invitationId);
    } catch (err) {
        console.error('Failed to resend invitation:', err);
    }
    return Response.json({ data: null }, { status: 200 });
}
