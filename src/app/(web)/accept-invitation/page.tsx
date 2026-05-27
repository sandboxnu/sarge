import AcceptInvitation from './AcceptInvitation';

export default async function AcceptInvitationPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;
    return <AcceptInvitation id={id ?? null} />;
}
