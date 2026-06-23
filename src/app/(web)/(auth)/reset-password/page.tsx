'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useResetPasswordPage from '@/lib/hooks/useResetPasswordPage';

export default function ResetPasswordPage() {
    const { form, isSending, didSendLink, submittedEmail, handleRequestReset, handleTryAgain } =
        useResetPasswordPage();

    if (didSendLink) {
        return (
            <div>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-display-xs">Check your email</h1>
                    <p className="text-body-s text-sarge-gray-600">
                        If an account exists for{' '}
                        <span className="text-sarge-gray-800 font-medium">{submittedEmail}</span>,
                        We've sent a link to reset your password. The link expires in 1 hour.
                    </p>
                </div>

                <div className="bg-sarge-gray-50 border-sarge-gray-200 mb-4 rounded-lg border p-4">
                    <p className="text-body-s text-sarge-gray-800">
                        Didn't get the email? Check your spam folder, or{' '}
                        <Button
                            variant="link"
                            type="button"
                            onClick={handleTryAgain}
                            className="h-auto p-0"
                        >
                            try again
                        </Button>
                        .
                    </p>
                </div>

                <div className="flex items-center justify-center gap-1 py-1">
                    <Link
                        href="/signin"
                        className="text-label-xs text-sarge-primary-500 hover:underline"
                    >
                        Back to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex flex-col items-center gap-2 text-center">
                <h1 className="text-display-xs">Reset your password</h1>
                <p className="text-body-s text-sarge-gray-600">
                    Enter the email you signed up with and we&apos;ll send you a link to reset your
                    password.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleRequestReset)} className="flex flex-col gap-4">
                <FieldGroup className="gap-4">
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel htmlFor="email" className="text-label-s">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="Enter Your Email Address"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isSending}
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
                    disabled={isSending}
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    {isSending ? 'Sending...' : 'Send reset link'}
                </Button>

                {form.formState.errors.root && (
                    <p className="text-sarge-error-700 text-body-xs">
                        {form.formState.errors.root.message}
                    </p>
                )}

                <div className="flex items-center justify-center gap-1 py-1">
                    <p className="text-label-xs text-sarge-gray-600">Remember your password?</p>
                    <Link
                        href="/signin"
                        className="text-label-xs text-sarge-primary-500 hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
