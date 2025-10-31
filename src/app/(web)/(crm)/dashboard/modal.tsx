'use client';

import { Button } from '@/lib/components/Button';

export default function WelcomeModal() {
    return (
        <div
            className="bg-sarge-gray-50 bg-opacity-50 fixed inset-0 flex items-center justify-center"
            role="dialog"
        >
            <div className="border-sarge-gray-200 flex h-78 w-140 flex-col items-center justify-center rounded-lg border bg-white p-6">
                <h2 className="mt-4 mb-2 text-center text-xl font-bold text-black">Welcome!</h2>
                <p className="mb-4 text-center text-base text-black">
                    Get started by creating or joining an organization. You&apos;ll be able to
                    manage tasks, assessments, and candidates all in one place.
                </p>
                <div>
                    <Button
                        className="mb-2 flex w-106 justify-center"
                        size="default"
                        variant="primary"
                    >
                        Create Organization
                    </Button>
                    <Button className="flex w-106 justify-center" size="default" variant="tertiary">
                        Join Organization
                    </Button>
                </div>
            </div>
        </div>
    );
}
