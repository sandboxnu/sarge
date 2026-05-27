import ResetPasswordConfirm from './ResetPasswordConfirm';

export default async function ResetPasswordConfirmPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string; error?: string }>;
}) {
    const { token, error } = await searchParams;
    return <ResetPasswordConfirm token={token} error={error} />;
}
