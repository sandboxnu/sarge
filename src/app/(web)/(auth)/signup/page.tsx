'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { signUp } from '@/lib/auth/better-auth-client';
import { Button } from '@/lib/components/Button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldDescription,
    Input,
} from '@/lib/components/shadcn/field';
import { createUserSchema } from '@/lib/schemas/user.schema';
import type { z } from 'zod';

type FormData = z.infer<typeof createUserSchema>;

export default function SignupPage() {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        const result = await signUp.email({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
        });

        if (result.error) {
            const message = result.error.message ?? 'An error occurred creating your account';
            const lowerMessage = message.toLowerCase();

            if (lowerMessage.includes('email') || lowerMessage.includes('already exists')) {
                form.setError('email', { message });
            } else if (lowerMessage.includes('password')) {
                form.setError('password', { message });
            } else if (lowerMessage.includes('name')) {
                form.setError('name', { message });
            } else {
                form.setError('root', { message });
            }
            return;
        }

        router.push('/dashboard');
        router.refresh();
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="border-sarge-gray-200 container mx-auto max-w-md rounded-lg border p-9">
                <h1 className="mb-6 text-center text-xl font-medium">Create an account</h1>

                {form.formState.errors.root && (
                    <div className="border-sarge-error-700 bg-sarge-error-200 mb-4 rounded-lg border p-3">
                        <p className="text-sarge-error-700 text-sm">
                            {form.formState.errors.root.message}
                        </p>
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="fullName"
                                        type="text"
                                        placeholder="First Last"
                                        aria-invalid={fieldState.invalid}
                                        disabled={form.formState.isSubmitting}
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
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        aria-invalid={fieldState.invalid}
                                        disabled={form.formState.isSubmitting}
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
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        aria-invalid={fieldState.invalid}
                                        disabled={form.formState.isSubmitting}
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
                        size="default"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Creating account...' : 'Continue'}
                    </Button>

                    <div className="flex gap-x-1 text-sm">
                        <p className="text-sarge-gray-600">Already have an account?</p>
                        <Link href="/signin" className="text-sarge-primary-500">
                            Log In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
