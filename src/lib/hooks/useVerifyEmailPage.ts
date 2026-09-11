'use client';

import { useState } from 'react';
import { sendVerificationEmail, useSession } from '@/lib/auth/auth-client';
import type { VerifyEmailStatus } from '@/lib/types/auth.types';

export default function useVerifyEmailPage({ error }: { error?: string }) {
    const { data: session, isPending: sessionPending } = useSession();
    const [resending, setResending] = useState(false);
    const [didResend, setDidResend] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);

    let status: VerifyEmailStatus;
    if (error) {
        status = 'invalid';
    } else if (session?.user?.emailVerified) {
        status = 'verified';
    } else {
        status = 'unverified';
    }

    const currentEmail = session?.user?.email ?? null;

    const handleResend = async () => {
        if (!currentEmail) return;
        setResending(true);
        setResendError(null);

        const result = await sendVerificationEmail({
            email: currentEmail,
            callbackURL: '/verify-email',
        });

        if (result.error) {
            setResendError(result.error.message ?? 'Could not send verification email.');
        } else {
            setDidResend(true);
        }
        setResending(false);
    };

    return {
        status,
        sessionPending,
        currentEmail,
        resending,
        didResend,
        resendError,
        handleResend,
    };
}
