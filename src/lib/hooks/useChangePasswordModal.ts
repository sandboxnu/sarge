'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { changePassword } from '@/lib/auth/auth-client';
import { changePasswordSchema, type ChangePasswordDTO } from '@/lib/schemas/user.schema';

type UseChangePasswordModalArgs = {
    onOpenChange: (open: boolean) => void;
};

export default function useChangePasswordModal({ onOpenChange }: UseChangePasswordModalArgs) {
    const form = useForm<ChangePasswordDTO>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    const { isSubmitting } = form.formState;

    const handleSubmit = async (values: ChangePasswordDTO) => {
        const result = await changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: true,
        });

        if (result.error) {
            // This determines where in the form to put the error and what the message should be
            switch (result.error.code) {
                case 'INVALID_PASSWORD':
                    form.setError('currentPassword', {
                        message: 'Current password is incorrect.',
                    });
                    break;
                default:
                    form.setError('root', {
                        message:
                            result.error.message ?? 'Could not change password. Please try again.',
                    });
            }
            return;
        }

        toast.success('Password updated. Other sessions have been signed out.');
        form.reset();
        onOpenChange(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            form.reset();
        }
        onOpenChange(nextOpen);
    };

    return {
        form,
        isSubmitting,
        handleSubmit,
        handleOpenChange,
    };
}
