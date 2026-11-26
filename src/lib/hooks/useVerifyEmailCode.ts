'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, emailOtp } from '@/lib/auth/auth-client';

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_OTP: 'Incorrect code',
    OTP_EXPIRED: 'This code has expired. Request a new one below.',
    TOO_MANY_ATTEMPTS: 'Too many attempts. Request a new code below.',
};

export default function useVerifyEmailCode(email: string) {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [codeResent, setCodeResent] = useState(false);

    const handleVerify = async () => {
        const otp = code.trim();
        if (!otp || verifying) return;

        setVerifying(true);
        setError(null);
        const result = await emailOtp.verifyEmail({ email, otp });
        setVerifying(false);

        if (result.error) {
            setError(
                ERROR_MESSAGES[result.error.code ?? ''] ?? 'Something went wrong. Please try again.'
            );
            return;
        }

        // autoSignInAfterVerification set a session cookie, but emailOTPClient doesn't tell the
        // client session store to refetch (sign-in/sign-up do), so useSession would stay signed out
        authClient.$store.notify('$sessionSignal');
        router.push('/crm/dashboard');
        router.refresh();
    };

    const handleResend = async () => {
        const result = await emailOtp.sendVerificationOtp({ email, type: 'email-verification' });
        if (result.error) {
            setError('Could not resend the code. Please try again.');
            return;
        }

        setError(null);
        setCode('');
        setCodeResent(true);
        setTimeout(() => setCodeResent(false), 1000); // Figma: "Code resent!" for 1 second
    };

    return { code, setCode, error, verifying, codeResent, handleVerify, handleResend };
}
