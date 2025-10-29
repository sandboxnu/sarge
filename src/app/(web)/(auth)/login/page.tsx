'use client';
import Link from 'next/link';
import { loginAction } from '@/lib/auth/auth-service';
import { useActionState, useEffect } from 'react';

export interface LoginState {
    success: boolean;
    errors: {
        email?: string[];
        password?: string[];
    };
    message: string;
}

const initialState: LoginState = {
    success: true,
    errors: {},
    message: '',
};

export default function LoginPage() {
    const [state, formAction] = useActionState(loginAction, initialState);

    useEffect(() => {
        if (state && !state.success && Object.keys(state.errors).length === 0 && state.message) {
            alert(state.message);
        }
    }, [state]);

    return (
        <div className="flex h-full items-center justify-center">
            <div className="border-sarge-gray-200 container mx-auto max-w-md rounded-lg border-1 p-9">
                <h1 className="mb-6 text-center text-xl font-medium">Sign In</h1>

                <form action={formAction} className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-0.5">
                            <label htmlFor="email" className="font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg px-2 py-3 border ${state?.errors?.password ? 'border-sarge-error-700' : 'border-sarge-gray-200'
                                    }`}
                                placeholder='example@gmail.com'
                            />
                            {state?.errors?.email && (
                                <p className="text-sm text-sarge-error-700">{state.errors.email[0]}</p>
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
                                className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg px-2 py-3 border ${state?.errors?.password ? 'border-sarge-error-700' : 'border-sarge-gray-200'
                                    }`}
                                placeholder='********'
                            />
                            {state?.errors?.password && (
                                <p className="text-sm text-sarge-error-700">{state.errors.password[0]}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-sarge-primary-500 hover:bg-sarge-primary-600 rounded-lg py-2 text-white transition-colors duration-200"
                    >
                        Continue
                    </button>

                    <div className="flex flex-col gap-y-1 text-sm">
                        <div className="flex gap-x-1">
                            <p className="text-sarge-gray-600">Don&apos;t have an account?</p>
                            <Link href={"/signup"} className="text-sarge-primary-500">
                                Create an account
                            </Link>
                        </div>

                        <div className="flex gap-x-1">
                            <p className="text-sarge-gray-600">Forgot your password?</p>
                            <Link href={"/reset-password"} className="text-sarge-primary-500">
                                Reset password
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
