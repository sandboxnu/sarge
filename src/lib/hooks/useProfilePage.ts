'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { authClient, changeEmail } from '@/lib/auth/auth-client';
import { updateProfileSchema, type UpdateProfileDTO } from '@/lib/schemas/user.schema';

export default function useProfilePage() {
    const router = useRouter();
    const { user, isPending } = useAuth();

    const form = useForm<UpdateProfileDTO>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: { name: '', email: '' },
        values: user ? { name: user.name, email: user.email } : undefined,
    });

    const { isDirty: hasUnsavedChanges, isSubmitting: isSaving } = form.formState;

    const handleSaveProfile = async (values: UpdateProfileDTO) => {
        if (!user) return;

        const nameChanged = values.name !== user.name;
        const emailChanged = values.email !== user.email.toLowerCase();

        if (!nameChanged && !emailChanged) {
            form.reset({ name: user.name, email: user.email });
            return;
        }

        try {
            if (nameChanged) {
                const result = await authClient.updateUser({ name: values.name });
                if (result.error) {
                    toast.error(result.error.message ?? 'Failed to update name. Please try again.');
                    return;
                }
            }

            if (emailChanged) {
                const result = await changeEmail({
                    newEmail: values.email,
                    callbackURL: '/verify-email',
                });

                if (result.error) {
                    const { code, message } = result.error;

                    switch (code) {
                        case 'INVALID_EMAIL':
                            form.setError('email', { message: 'Enter a valid email address.' });
                            break;

                        case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
                        case 'COULDNT_UPDATE_YOUR_EMAIL':
                            form.setError('email', {
                                message: 'An account with this email already exists.',
                            });
                            break;
                        case 'BAD_REQUEST':
                            if (message === 'Email is the same') {
                                form.setError('email', {
                                    message: 'New email must be different from your current email.',
                                });
                            } else {
                                form.setError('email', {
                                    message: message ?? 'Could not update email. Please try again.',
                                });
                            }
                            break;
                        default:
                            form.setError('email', {
                                message:
                                    message ?? 'Could not send verification email. Please try again.',
                            });
                    }
                    return;
                }

                toast.success(
                    `We sent a verification link to ${values.email}. Click it to finish updating your email.`
                );
            } else {
                toast.success('Profile updated');
            }

            form.reset({ name: values.name, email: user.email });
            router.refresh();
        } catch (err) {
            toast.error(
                `Failed to save profile: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
        }
    };

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            router.push('/signin');
            router.refresh();
        } catch (err) {
            toast.error(
                `Failed to sign out: ${err instanceof Error ? err.message : 'Unknown error'}`
            );
        }
    };

    const authReady = !isPending && user !== null;
    const fieldsLocked = isSaving || !authReady;

    return {
        form,
        user,
        hasUnsavedChanges,
        fieldsLocked,
        authReady,
        handleSaveProfile,
        handleSignOut,
    };
}
