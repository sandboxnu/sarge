'use client';

import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/lib/components/ui/Tooltip';
import useProfilePage from '@/lib/hooks/useProfilePage';

export default function ProfilePage() {
    const { form, hasUnsavedChanges, fieldsLocked, authReady, handleSaveProfile, handleSignOut } =
        useProfilePage();

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
                        {/* TODO(brad): wire up the password-change flow. Needs:
                            1. Current-password authentication using via better-auth's `changePassword` API.
                            2. we need to also implement the email-change verification flow when that ships*/}
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
