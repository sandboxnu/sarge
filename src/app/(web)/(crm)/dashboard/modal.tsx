'use client';

export default function WelcomeModal() {
    return (
        <div className="bg-s-lightgrey bg-opacity-50 fixed inset-0 flex justify-center items-center">
            <div className="rounded-lg bg-white p-6 border border-[#E5E5E5] w-140 h-78 flex flex-col items-center justify-center">
                <h2 className="mt-4 mb-2 text-xl font-bold text-black text-center">Welcome!</h2>
                <p className="text-black mb-4 text-base text-center">
                    Get started by creating or joining an organization. You&apos;ll be able to manage
                    tasks, assessments, and candidates all in one place.
                </p>
                <div>
                    <button className="bg-s-purple mt-2 flex w-106 justify-center rounded-lg py-2">
                        Create Organization
                    </button>
                    <button className="bg-white text-s-purple mt-2 mb-2 flex w-106 justify-center rounded-lg py-2">
                        Join Organization
                    </button>
                </div>
            </div>
        </div>
    );
}