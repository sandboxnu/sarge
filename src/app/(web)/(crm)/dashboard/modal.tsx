'use client';

export default function WelcomeModal() {
    return (
        <div className="bg-s-lightgrey bg-opacity-50 fixed inset-0 flex items-center justify-center">
            <div className="flex h-78 w-140 flex-col items-center justify-center rounded-lg border border-[#E5E5E5] bg-white p-6">
                <h2 className="mt-4 mb-2 text-center text-xl font-bold text-black">Welcome!</h2>
                <p className="mb-4 text-center text-base text-black">
                    Get started by creating or joining an organization. You&apos;ll be able to
                    manage tasks, assessments, and candidates all in one place.
                </p>
                <div>
                    <button className="bg-s-purple mt-2 flex w-106 justify-center rounded-lg py-2">
                        Create Organization
                    </button>
                    <button className="text-s-purple mt-1 mb-2 flex w-106 justify-center rounded-lg bg-white py-2">
                        Join Organization
                    </button>
                </div>
            </div>
        </div>
    );
}
