'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useResetPasswordConfirmPage from '@/lib/hooks/useResetPasswordConfirmPage';

export default function ResetPasswordConfirm({ token, error }: { token?: string; error?: string }) {
    const { form, isResetting, linkIsInvalid, didResetPassword, handleResetPassword } =
        useResetPasswordConfirmPage({ token, error });

    if (linkIsInvalid) {
        return (
            <>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-display-xs">Link is invalid</h1>
                    <p className="text-body-s text-sarge-gray-600">
                        This reset link is invalid or has expired. Request a new one to continue.
                    </p>
                </div>

                <Button
                    asChild
                    variant="primary"
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    <Link href="/reset-password">Request a new link</Link>
                </Button>

                <div className="mt-4 flex items-center justify-center gap-1 py-1">
                    <Link
                        href="/signin"
                        className="text-label-xs text-sarge-primary-500 hover:underline"
                    >
                        Back to sign in
                    </Link>
                </div>
            </>
        );
    }

    if (didResetPassword) {
        return (
            <>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-display-xs">Password updated</h1>
                    <p className="text-body-s text-sarge-gray-600">
                        Your password has been changed. You can now sign in with your new password.
                    </p>
                </div>

                <Button
                    asChild
                    variant="primary"
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    <Link href="/signin">Continue to sign in</Link>
                </Button>
            </>
        );
    }

    return (
        <>
            <div className="mb-8 flex flex-col items-center gap-2 text-center">
                <h1 className="text-display-xs">Set a new password</h1>
                <p className="text-body-s text-sarge-gray-600">
                    Choose a new password for your account.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
                <FieldGroup className="gap-4">
                    <Controller
                        name="newPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel htmlFor="newPassword" className="text-label-s">
                                    New password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="newPassword"
                                    type="password"
                                    placeholder="Your New Password"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isResetting}
                                    className="text-body-s h-11"
                                />
                                {!fieldState.error && (
                                    <FieldDescription>
                                        Password must be at least 8 characters
                                    </FieldDescription>
                                )}
                                <FieldError
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                />
                            </Field>
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel htmlFor="confirmPassword" className="text-label-s">
                                    Confirm new password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter Your Password"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isResetting}
                                    className="text-body-s h-11"
                                />
                                <FieldError
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                />
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isResetting}
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    {isResetting ? 'Updating...' : 'Update password'}
                </Button>

                {form.formState.errors.root && (
                    <p className="text-sarge-error-700 text-body-xs">
                        {form.formState.errors.root.message}
                    </p>
                )}

                <div className="flex items-center justify-center gap-1 py-1">
                    <Link
                        href="/signin"
                        className="text-label-xs text-sarge-primary-500 hover:underline"
                    >
                        Back to sign in
                    </Link>
                </div>
            </form>
        </>
    );
}
