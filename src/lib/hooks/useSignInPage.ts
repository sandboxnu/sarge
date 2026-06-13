'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { sendVerificationEmail, signIn } from '@/lib/auth/auth-client';
import { loginUserSchema, type LoginUserDTO } from '@/lib/schemas/user.schema';

export default function useSignInPage() {
    const router = useRouter();
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [didResend, setDidResend] = useState(false);

    const form = useForm<LoginUserDTO>({
        resolver: zodResolver(loginUserSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginUserDTO) => {
        const email = data.email.trim().toLowerCase();
        const result = await signIn.email({
            email,
            password: data.password,
        });

        if (result.error) {
            if (result.error.code === 'EMAIL_NOT_VERIFIED') {
                setUnverifiedEmail(email);
                setDidResend(false);
                return;
            }

            // This branching determines where in the form to put the error and also what the message should be
            switch (result.error.code) {
                case 'INVALID_EMAIL':
                    form.setError('email', { message: 'Enter a valid email address.' });
                    break;
                case 'INVALID_EMAIL_OR_PASSWORD':
                    form.setError('email', { type: 'manual' });
                    form.setError('password', { message: 'Invalid email or password.' });
                    break;
                default:
                    form.setError('root', {
                        message: result.error.message ?? 'Something went wrong. Please try again.',
                    });
            }
            return;
        }

        router.push('/crm/dashboard');
        router.refresh();
    };

    const handleResendVerification = async () => {
        if (!unverifiedEmail) return;
        setResending(true);
        const result = await sendVerificationEmail({
            email: unverifiedEmail,
            callbackURL: '/verify-email',
        });
        if (!result.error) {
            setDidResend(true);
        }
        setResending(false);
    };

    const handleBackToSignIn = () => {
        setUnverifiedEmail(null);
        setDidResend(false);
    };

    return {
        form,
        unverifiedEmail,
        resending,
        didResend,
        onSubmit,
        handleResendVerification,
        handleBackToSignIn,
    };
}
