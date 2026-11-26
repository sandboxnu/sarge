'use client';

import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useVerifyEmailCode from '@/lib/hooks/useVerifyEmailCode';

export default function VerifyEmailCode({ email }: { email: string }) {
    const { code, setCode, error, verifying, codeResent, handleVerify, handleResend } =
        useVerifyEmailCode(email);

    return (
        <div>
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <h1 className="text-display-xs">Confirm your email</h1>
            </div>

            <p className="text-body-s text-sarge-gray-800 mb-6">
                Check your email account for the verification code we just sent you and enter the
                code below.
            </p>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleVerify();
                }}
                className="flex flex-col gap-4"
            >
                <Field className="gap-2">
                    <FieldLabel htmlFor="code" className="text-label-s">
                        Enter code
                    </FieldLabel>
                    <Input
                        id="code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="Enter your code"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        aria-invalid={error !== null}
                        disabled={verifying}
                        className="text-body-s h-11"
                    />
                    <FieldError errors={error ? [{ message: error }] : undefined} />
                </Field>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={!code.trim() || verifying}
                    className="text-label-s text-sarge-gray-50 h-11 w-full px-4"
                >
                    {verifying ? 'Verifying...' : 'Continue'}
                </Button>
            </form>

            <div className="mt-4 flex items-center gap-1 py-1">
                <p className="text-label-xs text-sarge-gray-600">Didn't get the email?</p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={codeResent}
                    className="text-label-xs text-sarge-primary-500 hover:underline"
                >
                    {codeResent ? 'Code resent!' : 'Resend code'}
                </button>
            </div>
        </div>
    );
}
