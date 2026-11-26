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
import { PasswordInput } from '@/lib/components/ui/PasswordInput';
import useSignUpPage from '@/lib/hooks/useSignUpPage';
import VerifyEmailCode from '@/lib/components/auth/VerifyEmailCode';

export default function SignupPage() {
    const { form, verificationPendingEmail, onSubmit } = useSignUpPage();

    if (verificationPendingEmail) {
        return <VerifyEmailCode email={verificationPendingEmail} />;
    }

    return (
        <div>
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
                                <PasswordInput
                                    {...field}
                                    id="password"
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

                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="gap-2">
                                <FieldLabel htmlFor="confirmPassword" className="text-label-s">
                                    Confirm Password
                                </FieldLabel>
                                <PasswordInput
                                    {...field}
                                    id="confirmPassword"
                                    placeholder="Re-enter Your Password"
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
        </div>
    );
}
