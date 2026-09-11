'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { requestPasswordReset } from '@/lib/auth/auth-client';
import {
    requestPasswordResetSchema,
    type RequestPasswordResetDTO,
} from '@/lib/schemas/user.schema';

export default function useResetPasswordPage() {
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

    const form = useForm<RequestPasswordResetDTO>({
        resolver: zodResolver(requestPasswordResetSchema),
        defaultValues: { email: '' },
    });

    const { isSubmitting: isSending } = form.formState;
    const didSendLink = submittedEmail !== null;

    const handleRequestReset = async (values: RequestPasswordResetDTO) => {
        const email = values.email.trim().toLowerCase();
        const redirectTo = `${window.location.origin}/reset-password/confirm`;

        const result = await requestPasswordReset({ email, redirectTo });

        if (result.error) {
            form.setError('root', {
                message: result.error.message ?? 'Something went wrong. Please try again.',
            });
            return;
        }

        setSubmittedEmail(email);
    };

    const handleTryAgain = () => {
        setSubmittedEmail(null);
        form.reset();
    };

    return {
        form,
        isSending,
        didSendLink,
        submittedEmail,
        handleRequestReset,
        handleTryAgain,
    };
}
