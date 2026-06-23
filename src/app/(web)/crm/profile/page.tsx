'use client';

import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import ChangePasswordModal from '@/lib/components/modal/ChangePasswordModal';
import useProfilePage from '@/lib/hooks/useProfilePage';

export default function ProfilePage() {
    const {
        form,
        hasUnsavedChanges,
        fieldsLocked,
        authReady,
        changePasswordOpen,
        setChangePasswordOpen,
        handleSaveProfile,
        handleSignOut,
    } = useProfilePage();

    return (
        <>
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
                            className="text-label-s h-11 px-4"
                            disabled={!hasUnsavedChanges || fieldsLocked}
                            onClick={() => form.reset()}
                        >
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="text-label-s text-sarge-gray-50 h-11 px-4"
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
                                <Field className="gap-2">
                                    <FieldLabel htmlFor="profile-name" className="text-label-s">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="profile-name"
                                        autoComplete="name"
                                        aria-invalid={fieldState.invalid}
                                        disabled={fieldsLocked}
                                        className="text-body-s h-11 w-full"
                                    />
                                    <FieldError
                                        errors={fieldState.error ? [fieldState.error] : undefined}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="border-sarge-gray-200 flex flex-col gap-7 border-t pt-7">
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel
                                            htmlFor="profile-email"
                                            className="text-label-s"
                                        >
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="profile-email"
                                            type="email"
                                            autoComplete="email"
                                            aria-invalid={fieldState.invalid}
                                            disabled={fieldsLocked}
                                            className="text-body-s h-11 w-full"
                                        />
                                        <FieldError
                                            errors={
                                                fieldState.error ? [fieldState.error] : undefined
                                            }
                                        />
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <Field className="gap-2">
                            <FieldLabel className="text-label-s">Password</FieldLabel>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="password"
                                    value="********************"
                                    readOnly
                                    disabled
                                    aria-hidden
                                    tabIndex={-1}
                                    className="text-body-s bg-sarge-gray-100 h-11 min-w-0 flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="text-label-s text-sarge-gray-50 h-11 shrink-0 px-4"
                                    disabled={!authReady}
                                    onClick={() => setChangePasswordOpen(true)}
                                >
                                    Change Password
                                </Button>
                            </div>
                        </Field>
                    </div>

                    <div className="flex justify-start">
                        <Button
                            type="button"
                            variant="secondary"
                            className="text-label-s h-11 px-4"
                            disabled={!authReady}
                            onClick={handleSignOut}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </form>

            <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
        </>
    );
}
