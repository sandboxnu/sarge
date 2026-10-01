'use client';

import { useAuth } from '@/lib/auth/auth-context';
import AdminOnboardingButton from '@/lib/components/core/AdminOnboardingButton';
import OnboardingModal from '@/lib/components/modal/OnboardingModal';
import useOnboardingState from '@/lib/hooks/useOnboardingState';
import Image from 'next/image';

export default function DashboardPage() {
    const { isOnboarding, isSignedOut, isUserLoading } = useOnboardingState();
    const { isSuperUser } = useAuth();

    if (isUserLoading) return <div>Loading...</div>;
    if (isSignedOut) return <div>You must be signed in...</div>;

    return (
        <div>
            {isOnboarding ? (
                <>
                    <OnboardingModal />
                    {isSuperUser && <AdminOnboardingButton />}
                </>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-6">
                    <Image
                        src="/HelmetLogoFull.png"
                        alt="Helmet Logo"
                        width={900}
                        height={900}
                        priority
                    />
                    <p className="text-sarge-primary-700 text-xl">Coming 2026...</p>
                </div>
            )}
        </div>
    );
}
