'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { emailOtp, signIn } from '@/lib/auth/auth-client';
import { loginUserSchema, type LoginUserDTO } from '@/lib/schemas/user.schema';

export default function useSignInPage() {
    const router = useRouter();
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

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
                // the code from signup has likely expired (5 min), so send a fresh one
                await emailOtp.sendVerificationOtp({ email, type: 'email-verification' });
                setUnverifiedEmail(email);
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

    const handleBackToSignIn = () => {
        setUnverifiedEmail(null);
    };

    return {
        form,
        unverifiedEmail,
        onSubmit,
        handleBackToSignIn,
    };
}
