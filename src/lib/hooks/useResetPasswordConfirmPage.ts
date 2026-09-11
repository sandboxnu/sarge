'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { resetPassword } from '@/lib/auth/auth-client';
import { resetPasswordSchema, type ResetPasswordDTO } from '@/lib/schemas/user.schema';

export default function useResetPasswordConfirmPage({
    token,
    error,
}: {
    token?: string;
    error?: string;
}) {
    const linkIsInvalid = error === 'INVALID_TOKEN' || !token;

    const [didResetPassword, setDidResetPassword] = useState(false);

    const form = useForm<ResetPasswordDTO>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: '', confirmPassword: '' },
    });

    const { isSubmitting: isResetting } = form.formState;

    const handleResetPassword = async (values: ResetPasswordDTO) => {
        if (!token) {
            form.setError('root', {
                message: 'Missing reset token. Please request a new link.',
            });
            return;
        }

        const result = await resetPassword({
            newPassword: values.newPassword,
            token,
        });

        if (result.error) {
            form.setError('root', {
                message: result.error.message ?? 'Something went wrong. Please try again.',
            });
            return;
        }

        setDidResetPassword(true);
    };

    return {
        form,
        isResetting,
        linkIsInvalid,
        didResetPassword,
        handleResetPassword,
    };
}
