import AcceptInvitation from '@/lib/components/core/AcceptInvitation';
import InvitationService from '@/lib/services/invitation.service';

export default async function AcceptInvitationPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;
    const expired = id ? await InvitationService.isInvitationExpired(id) : false;
    return <AcceptInvitation id={id ?? null} expired={expired} />;
}
