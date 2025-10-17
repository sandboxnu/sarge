'use client';
import Link from 'next/link';
import { signup } from '@/lib/auth/auth-service';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';

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
    const [state, formAction] = useFormState(signup, initialState);

    useEffect(() => {
        if (state && !state.success && Object.keys(state.errors).length === 0 && state.message) {
            alert(state.message);
        }
    }, [state]);

    return (
        <div className="flex min-h-screen items-center">
            <div className="border-s-lightgrey container mx-auto max-w-md rounded-lg border-2 p-9">
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
                                className="bg-s-lightgrey rounded-lg px-2 py-3"
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
                                className="bg-s-lightgrey rounded-lg px-2 py-3"
                            />
                            {state?.errors?.email && (
                                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
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
                                className="bg-s-lightgrey rounded-lg px-2 py-3"
                            />
                            {state?.errors?.password && (
                                <p className="text-sm text-red-500">{state.errors.password[0]}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-s-purple hover:bg-s-purple/90 rounded-lg py-3 text-white transition-colors duration-200"
                    >
                        Continue
                    </button>

                    <div className="flex gap-x-1 text-sm">
                        <p>Already have an account?</p>
                        <Link href={'/login'} className="text-s-purple">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
