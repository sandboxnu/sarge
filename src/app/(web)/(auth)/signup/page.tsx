'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useSignUpPage from '@/lib/hooks/useSignUpPage';

export default function SignupPage() {
    const {
        form,
        verificationPendingEmail,
        resending,
        didResend,
        onSubmit,
        handleResendVerification,
    } = useSignUpPage();

    if (verificationPendingEmail) {
        return (
            <>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-display-xs">Check your email</h1>
                    <p className="text-body-s text-sarge-gray-600">
                        We've sent a verification link to{' '}
                        <span className="text-sarge-gray-800 font-medium">
                            {verificationPendingEmail}
                        </span>
                        . Click it to finish creating your account. The link expires in 1 hour.
                    </p>
                </div>

                {didResend ? (
                    <div className="border-sarge-primary-200 bg-sarge-primary-100 mb-4 rounded-lg border p-4">
                        <p className="text-body-s text-sarge-gray-800">
                            New verification link sent.
                        </p>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleResendVerification}
                        disabled={resending}
                        className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                    >
                        {resending ? 'Sending...' : 'Resend verification link'}
                    </Button>
                )}

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

    return (
        <>
            <div className="mb-8 flex justify-center">
                <h1 className="text-display-xs">Create an account</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FieldGroup className="gap-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="gap-2">
                                <FieldLabel htmlFor="fullName" className="text-label-s">
                                    Full Name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter Your Full Name"
                                    aria-invalid={fieldState.invalid}
                                    disabled={form.formState.isSubmitting}
                                    className="text-body-s h-11"
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
                            <Field className="gap-2">
                                <FieldLabel htmlFor="email" className="text-label-s">
                                    Email
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="Enter Your Email Address"
                                    aria-invalid={fieldState.invalid}
                                    disabled={form.formState.isSubmitting}
                                    className="text-body-s h-11"
                                />
                                <FieldError
                                    errors={fieldState.error ? [fieldState.error] : undefined}
                                />
                            </Field>
                        )}
                    />

                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="gap-2">
                                <FieldLabel htmlFor="password" className="text-label-s">
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="Your Password"
                                    aria-invalid={fieldState.invalid}
                                    disabled={form.formState.isSubmitting}
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
                </FieldGroup>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={form.formState.isSubmitting}
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    {form.formState.isSubmitting ? 'Creating account...' : 'Continue'}
                </Button>

                {form.formState.errors.root && (
                    <p className="text-sarge-error-700 text-body-xs">
                        {form.formState.errors.root.message}
                    </p>
                )}

                <div className="flex items-center gap-1 py-1">
                    <p className="text-label-xs text-sarge-gray-600">Already have an account?</p>
                    <Link
                        href="/signin"
                        className="text-label-xs text-sarge-primary-500 hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
        </>
    );
}
