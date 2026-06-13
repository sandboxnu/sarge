import VerifyEmail from '@/lib/components/auth/VerifyEmail';

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    return <VerifyEmail error={error} />;
}
