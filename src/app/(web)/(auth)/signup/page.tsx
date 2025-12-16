'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { signUp } from '@/lib/auth/auth-client';
import { Button } from '@/lib/components/Button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from '@/lib/components/Field';
import { Input } from '@/lib/components/Input';
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

        router.push('crm/dashboard');
        router.refresh();
    };

    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            <div className="relative hidden overflow-hidden bg-white lg:flex lg:w-1/2">
                <div className="from-sarge-primary-100 absolute -top-[42px] left-0 h-[calc(100%+84px)] w-full rounded-r-2xl bg-linear-to-b to-white" />

                <div className="absolute top-0 left-0 z-10 pt-6 pr-6">
                    <Image src="/HelmetLogoFull.png" alt="Sarge" width={200} height={61} priority />
                </div>

                <div className="relative flex flex-1 items-center justify-center px-8 pt-24 pb-10 lg:px-12">
                    <div className="flex h-full max-w-md flex-col">
                        <p className="text-body-m text-sarge-gray-800 mb-10">
                            With Sarge you&apos;ll be able to manage tasks, assessments, and
                            candidates <span className="font-bold">all in one place.</span>
                        </p>
                        <div className="w-full flex-1 rounded-md bg-linear-to-b from-white via-white to-white/0 shadow-[0_-4px_8px_0_rgba(0,0,0,0.03)]" />
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-8 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex justify-center">
                        <h1 className="text-display-xs text-sarge-gray-800">Create an account</h1>
                    </div>

                    {form.formState.errors.root && (
                        <div className="border-sarge-error-700 bg-sarge-error-200 mb-6 rounded-lg border p-3">
                            <p className="text-body-s text-sarge-error-700">
                                {form.formState.errors.root.message}
                            </p>
                        </div>
                    )}

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FieldGroup className="gap-4">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-2">
                                        <FieldLabel
                                            htmlFor="fullName"
                                            className="text-label-s text-sarge-gray-800"
                                        >
                                            Full Name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="fullName"
                                            type="text"
                                            placeholder="Enter Your Full Name"
                                            aria-invalid={fieldState.invalid}
                                            disabled={form.formState.isSubmitting}
                                            className="text-body-s border-sarge-gray-200 bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-800 h-11 rounded-lg border px-3 py-1"
                                        />
                                        <FieldError
                                            errors={
                                                fieldState.error ? [fieldState.error] : undefined
                                            }
                                        />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-2">
                                        <FieldLabel
                                            htmlFor="email"
                                            className="text-label-s text-sarge-gray-800"
                                        >
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="Enter Your Email Address"
                                            aria-invalid={fieldState.invalid}
                                            disabled={form.formState.isSubmitting}
                                            className="text-body-s border-sarge-gray-200 bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-800 h-11 rounded-lg border px-3 py-1"
                                        />
                                        <FieldError
                                            errors={
                                                fieldState.error ? [fieldState.error] : undefined
                                            }
                                        />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-2">
                                        <FieldLabel
                                            htmlFor="password"
                                            className="text-label-s text-sarge-gray-800"
                                        >
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            placeholder="Your Password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={form.formState.isSubmitting}
                                            className="text-body-s border-sarge-gray-200 bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-800 h-11 rounded-lg border px-3 py-1"
                                        />
                                        {!fieldState.error && (
                                            <FieldDescription className="text-body-xs text-sarge-gray-500">
                                                Password must be at least 8 characters
                                            </FieldDescription>
                                        )}
                                        <FieldError
                                            errors={
                                                fieldState.error ? [fieldState.error] : undefined
                                            }
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
                            className="text-label-s bg-sarge-primary-500 text-sarge-gray-50 hover:bg-sarge-primary-600 h-11 w-full rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                        >
                            {form.formState.isSubmitting ? 'Creating account...' : 'Continue'}
                        </Button>

                        <div className="flex items-center gap-1 py-1">
                            <p className="text-label-xs text-sarge-gray-600">
                                Already have an account?
                            </p>
                            <Link
                                href="/signin"
                                className="text-label-xs text-sarge-primary-500 hover:underline"
                            >
                                Log In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
