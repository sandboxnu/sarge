'use client';

import { useState } from 'react';
import Image from 'next/image';
import OnboardingModal from '@/lib/components/modal/OnboardingModal';
import InviteUsersModal from '@/lib/components/modal/InviteUsersModal';
import { Button } from '@/lib/components/ui/Button';
import useOnboardingState from '@/lib/hooks/useOnboardingState';

export default function DashboardPage() {
    const { isOnboarding, isSignedOut, isUserLoading, organizationName } = useOnboardingState();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    if (isUserLoading) return <div>Loading...</div>;
    if (isSignedOut) return <div>You must be signed in...</div>;

    return (
        <div>
            {isOnboarding ? (
                <OnboardingModal />
            ) : (
                <div className="flex h-screen flex-col items-center justify-center gap-6">
                    <Image
                        src="/HelmetLogoFull.png"
                        alt="Helmet Logo"
                        width={900}
                        height={900}
                        priority
                    />
                    <p className="text-sarge-primary-700 text-xl">Coming 2026...</p>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsInviteModalOpen(true)}
                        className="h-9 px-4"
                    >
                        Open Invite Modal
                    </Button>
                    <InviteUsersModal
                        open={isInviteModalOpen}
                        onOpenChange={setIsInviteModalOpen}
                        organizationName={organizationName ?? undefined}
                    />
                </div>
            )}
        </div>
    );
}
