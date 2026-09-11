'use client';

import Link from 'next/link';
import { Button } from '@/lib/components/ui/Button';
import useVerifyEmailPage from '@/lib/hooks/useVerifyEmailPage';

export default function VerifyEmail({ error }: { error?: string }) {
    const {
        status,
        sessionPending,
        currentEmail,
        resending,
        didResend,
        resendError,
        handleResend,
    } = useVerifyEmailPage({ error });

    if (sessionPending && status !== 'invalid') {
        return <div className="text-body-s text-sarge-gray-600 text-center">Loading...</div>;
    }

    if (status === 'invalid') {
        return (
            <>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-display-xs">Link is invalid</h1>
                    <p className="text-body-s text-sarge-gray-600">
                        This verification link is invalid or has expired.
                        {currentEmail
                            ? ' You can request a new one below.'
                            : ' Sign in to request a new one.'}
                    </p>
                </div>

                {currentEmail ? (
                    didResend ? (
                        <div className="border-sarge-primary-200 bg-sarge-primary-100 rounded-lg border p-4">
                            <p className="text-body-s text-sarge-gray-800">
                                New verification link sent to{' '}
                                <span className="font-medium">{currentEmail}</span>.
                            </p>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                        >
                            {resending ? 'Sending...' : 'Send a new link'}
                        </Button>
                    )
                ) : (
                    <Button
                        asChild
                        variant="primary"
                        className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                    >
                        <Link href="/signin">Back to sign in</Link>
                    </Button>
                )}

                {resendError && (
                    <p className="text-sarge-error-700 text-body-xs mt-3 text-center">
                        {resendError}
                    </p>
                )}
            </>
        );
    }

    if (status === 'verified') {
        return (
            <>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <h1 className="text-display-xs">Email verified</h1>
                    <p className="text-body-s text-sarge-gray-600">
                        {currentEmail ? (
                            <>
                                Your email{' '}
                                <span className="text-sarge-gray-800 font-medium">
                                    {currentEmail}
                                </span>{' '}
                                is verified. You're signed in.
                            </>
                        ) : (
                            'Your email is verified.'
                        )}
                    </p>
                </div>

                <Button
                    asChild
                    variant="primary"
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    <Link href="/crm/dashboard">Continue to Sarge</Link>
                </Button>
            </>
        );
    }

    return (
        <>
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <h1 className="text-display-xs">Verify your email</h1>
                <p className="text-body-s text-sarge-gray-600">
                    Sign in to request a verification link.
                </p>
            </div>

            <Button
                asChild
                variant="primary"
                className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
            >
                <Link href="/signin">Go to sign in</Link>
            </Button>
        </>
    );
}
