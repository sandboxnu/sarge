'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useSignInPage from '@/lib/hooks/useSignInPage';
import VerifyEmailCode from '@/lib/components/auth/VerifyEmailCode';

export default function SignInPage() {
    const { form, unverifiedEmail, onSubmit, handleBackToSignIn } = useSignInPage();

    if (unverifiedEmail) {
        return (
            <div>
                <VerifyEmailCode email={unverifiedEmail} />

                <div className="mt-2 flex items-center gap-1 py-1">
                    <Button
                        type="button"
                        variant="link"
                        onClick={handleBackToSignIn}
                        className="text-label-xs text-sarge-primary-500 h-auto p-0"
                    >
                        Back to sign in
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex justify-center">
                <h1 className="text-display-xs">Sign in to Sarge</h1>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FieldGroup className="gap-4">
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
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password" className="text-label-s">
                                        Password
                                    </FieldLabel>
                                    <Link
                                        href="/reset-password"
                                        className="text-label-xs text-sarge-primary-500 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="Your Password"
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
                </FieldGroup>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={form.formState.isSubmitting}
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    {form.formState.isSubmitting ? 'Logging in...' : 'Continue'}
                </Button>

                {form.formState.errors.root && (
                    <p className="text-sarge-error-700 text-body-xs">
                        {form.formState.errors.root.message}
                    </p>
                )}

                <div className="flex items-center gap-1 py-1">
                    <p className="text-label-xs text-sarge-gray-600">Don't have an account?</p>
                    <Link
                        href="/signup"
                        className="text-label-xs text-sarge-primary-500 hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
}
