'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useResetPasswordPage from '@/lib/hooks/useResetPasswordPage';

export default function ResetPasswordPage() {
    const { form, isSending, didSendLink, submittedEmail, handleRequestReset, handleTryAgain } =
        useResetPasswordPage();

    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            <div className="bg-sarge-gray-0 relative hidden overflow-hidden lg:flex lg:w-1/2">
                <div className="from-sarge-primary-100 to-sarge-gray-0 absolute -inset-y-10 left-0 w-full rounded-r-2xl bg-linear-to-b" />

                <div className="absolute top-0 left-0 z-10 pt-6 pr-6">
                    <Image src="/HelmetLogoFull.png" alt="Sarge" width={200} height={61} priority />
                </div>

                <div className="relative flex flex-1 items-center justify-center px-8 pt-24 pb-10 lg:px-12">
                    <div className="flex h-full max-w-md flex-col">
                        <p className="text-body-m text-sarge-gray-800 mb-10">
                            With Sarge you&apos;ll be able to manage tasks, assessments, and
                            candidates <span className="font-bold">all in one place.</span>
                        </p>
                        <div className="from-sarge-gray-0 via-sarge-gray-0 to-sarge-gray-0/0 w-full flex-1 rounded-md bg-linear-to-b shadow-[0_-4px_8px_0_rgba(0,0,0,0.03)]" />
                    </div>
                </div>
            </div>

            <div className="bg-sarge-gray-0 flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-sm">
                    {didSendLink ? (
                        <>
                            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                                <h1 className="text-display-xs">Check your email</h1>
                                <p className="text-body-s text-sarge-gray-600">
                                    If an account exists for{' '}
                                    <span className="text-sarge-gray-800 font-semibold">
                                        {submittedEmail}
                                    </span>
                                    , we&apos;ve sent a link to reset your password. The link
                                    expires in 1 hour.
                                </p>
                            </div>

                            <div className="border-sarge-primary-200 bg-sarge-primary-100 mb-4 rounded-lg border p-4">
                                <p className="text-body-s text-sarge-gray-800">
                                    Didn&apos;t get the email? Check your spam folder, or{' '}
                                    <button
                                        type="button"
                                        onClick={handleTryAgain}
                                        className="text-sarge-primary-500 font-semibold hover:underline"
                                    >
                                        try again
                                    </button>
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
                        </>
                    ) : (
                        <>
                            <div className="mb-8 flex flex-col items-center gap-2 text-center">
                                <h1 className="text-display-xs">Reset your password</h1>
                                <p className="text-body-s text-sarge-gray-600">
                                    Enter the email you signed up with and we&apos;ll send you a
                                    link to reset your password.
                                </p>
                            </div>

                            <form
                                onSubmit={form.handleSubmit(handleRequestReset)}
                                className="flex flex-col gap-4"
                            >
                                <FieldGroup className="gap-4">
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={fieldState.invalid}
                                                className="gap-2"
                                            >
                                                <FieldLabel
                                                    htmlFor="email"
                                                    className="text-label-s"
                                                >
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
                                                    errors={
                                                        fieldState.error
                                                            ? [fieldState.error]
                                                            : undefined
                                                    }
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
                                    <p className="text-label-xs text-sarge-gray-600">
                                        Remember your password?
                                    </p>
                                    <Link
                                        href="/signin"
                                        className="text-label-xs text-sarge-primary-500 hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
