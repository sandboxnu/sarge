'use client';
import Link from 'next/link';
import { signup } from '@/lib/auth/auth-service';
import { useActionState, useEffect } from 'react';
import { Button } from '@/lib/components/Button';

export interface SignupState {
    success: boolean;
    errors: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message: string;
}

const initialState: SignupState = {
    success: true,
    errors: {},
    message: '',
};

export default function SignupPage() {
    const [state, formAction] = useActionState(signup, initialState);

    useEffect(() => {
        if (state && !state.success && Object.keys(state.errors).length === 0 && state.message) {
            alert(state.message);
        }
    }, [state]);

    return (
        <div className="flex h-full items-center justify-center">
            <div className="border-sarge-gray-200 container mx-auto max-w-md rounded-lg border-1 p-9">
                <h1 className="mb-6 text-center text-xl font-medium">Create an account</h1>

                <form action={formAction} className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="fullName" className="font-semibold">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg border px-2 py-3 ${
                                    state?.errors?.password
                                        ? 'border-sarge-error-700'
                                        : 'border-sarge-gray-200'
                                }`}
                                placeholder="First Last"
                            />
                            {state?.errors?.name && (
                                <p className="text-sm text-red-500">{state.errors.name[0]}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="email" className="font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg border px-2 py-3 ${
                                    state?.errors?.password
                                        ? 'border-sarge-error-700'
                                        : 'border-sarge-gray-200'
                                }`}
                                placeholder="example@gmail.com"
                            />
                            {state?.errors?.email && (
                                <p className="text-sarge-error-700 text-sm">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="password" className="font-semibold">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg border px-2 py-3 ${
                                    state?.errors?.password
                                        ? 'border-sarge-error-700'
                                        : 'border-sarge-gray-200'
                                }`}
                                placeholder="********"
                            />
                            {state?.errors?.password && (
                                <p className="text-sarge-error-700 text-sm">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button type="submit" variant="primary" size="default">
                        Continue
                    </Button>

                    <div className="flex gap-x-1 text-sm">
                        <p className="text-sarge-gray-600">Already have an account?</p>
                        <Link href={'/login'} className="text-sarge-primary-500">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
