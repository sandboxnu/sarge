'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { authClient } from '@/lib/auth/auth-client';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/lib/components/ui/Tooltip';
import { updateProfileSchema, type UpdateProfileDTO } from '@/lib/schemas/user.schema';

export default function ProfilePage() {
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

    return (
        <form
            onSubmit={form.handleSubmit(handleSaveProfile)}
            className="flex flex-col gap-6 pt-4 pr-5 pb-5 pl-7"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-display-xs">Profile Settings</h1>
                <div className="flex shrink-0 items-center gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        className="h-11 px-4"
                        disabled={!hasUnsavedChanges || fieldsLocked}
                        onClick={() => form.reset()}
                    >
                        Discard Changes
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="h-11 px-4"
                        disabled={!hasUnsavedChanges || fieldsLocked}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-7">
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="profile-name" className="text-label-m">
                                    Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="profile-name"
                                    autoComplete="name"
                                    aria-invalid={fieldState.invalid}
                                    disabled={fieldsLocked}
                                    className="h-11 w-full"
                                />
                                <FieldError
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                />
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="profile-email" className="text-label-m">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="profile-email"
                                    type="email"
                                    autoComplete="email"
                                    aria-invalid={fieldState.invalid}
                                    disabled={fieldsLocked}
                                    className="h-11 w-full"
                                />
                                <FieldError
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                />
                            </Field>
                        )}
                    />
                </FieldGroup>

                <div className="border-sarge-gray-200 border-t pt-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <Field className="min-w-0 flex-1 opacity-50">
                            <FieldLabel htmlFor="profile-password" className="text-label-m">
                                Password
                            </FieldLabel>
                            <Input
                                id="profile-password"
                                type="password"
                                placeholder="••••••••••••••••"
                                disabled
                                className="h-11 w-full"
                            />
                        </Field>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="inline-flex shrink-0 sm:self-end">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="h-11 px-4"
                                        disabled
                                    >
                                        Change Password
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Password change is not available yet
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="mt-4 flex justify-start">
                        <Button
                            type="button"
                            variant="secondary"
                            className="h-11 px-4"
                            disabled={!authReady}
                            onClick={handleSignOut}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
