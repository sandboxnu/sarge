'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { sendVerificationEmail, signUp } from '@/lib/auth/auth-client';
import { createUserSchema, type CreateUserDTO } from '@/lib/schemas/user.schema';

export default function useSignUpPage() {
    const router = useRouter();
    const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [didResend, setDidResend] = useState(false);

    const form = useForm<CreateUserDTO>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: CreateUserDTO) => {
        const email = data.email.trim().toLowerCase();
        const result = await signUp.email({
            name: data.name.trim(),
            email,
            password: data.password,
        });

        if (result.error) {
            // This determines where in the form to put the error and what the message should be
            switch (result.error.code) {
                case 'INVALID_EMAIL':
                    form.setError('email', { message: 'Enter a valid email address.' });
                    break;
                case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
                    form.setError('email', {
                        message: 'An account with this email already exists.',
                    });
                    break;
                case 'PASSWORD_TOO_SHORT':
                    form.setError('password', { message: 'Password is too short.' });
                    break;
                case 'PASSWORD_TOO_LONG':
                    form.setError('password', { message: 'Password is too long.' });
                    break;
                default:
                    form.setError('root', {
                        message: result.error.message ?? 'An error occurred creating your account.',
                    });
            }
            return;
        }

        // When email verification is required, better-auth returns the user but no session token.
        // In that case, show the "check your email" state instead of redirecting.
        if (!result.data?.token) {
            setVerificationPendingEmail(email);
            return;
        }

        router.push('/crm/dashboard');
        router.refresh();
    };

    const handleResendVerification = async () => {
        if (!verificationPendingEmail) return;
        setResending(true);
        const result = await sendVerificationEmail({
            email: verificationPendingEmail,
            callbackURL: '/verify-email',
        });
        if (!result.error) {
            setDidResend(true);
        }
        setResending(false);
    };

    return {
        form,
        verificationPendingEmail,
        resending,
        didResend,
        onSubmit,
        handleResendVerification,
    };
}
