'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { authClient } from '@/lib/auth/auth-client';
import { updateProfileSchema, type UpdateProfileDTO } from '@/lib/schemas/user.schema';

export default function useProfilePage() {
    const router = useRouter();
    const { user, isPending } = useAuth();

    const form = useForm<UpdateProfileDTO>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: { name: '', email: '' },
        values: user ? { name: user.name, email: user.email } : undefined,
    });

    const {
        isDirty: hasUnsavedChanges,
        isSubmitting: isSaving,
        dirtyFields: changedFields,
    } = form.formState;

    const handleSaveProfile = async (values: UpdateProfileDTO) => {
        try {
            if (changedFields.name) {
                const nameResult = await authClient.updateUser({ name: values.name });
                if (nameResult.error) {
                    toast.error(
                        nameResult.error.message ?? 'Failed to update name. Please try again.'
                    );
                    return;
                }
            }

            if (changedFields.email) {
                const emailResult = await authClient.changeEmail({
                    newEmail: values.email,
                    callbackURL: '/crm/profile',
                });
                if (emailResult.error) {
                    toast.error(
                        emailResult.error.message ?? 'Failed to update email. Please try again.'
                    );
                    return;
                }
            }

            toast.success('Profile updated');
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

    const authReady = !isPending && Boolean(user);
    const fieldsLocked = isSaving || !authReady;

    return {
        form,
        hasUnsavedChanges,
        fieldsLocked,
        authReady,
        handleSaveProfile,
        handleSignOut,
    };
}
