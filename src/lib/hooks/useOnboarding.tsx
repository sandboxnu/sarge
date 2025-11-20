import { useCallback, useEffect, useState } from 'react';
import { useActiveMember, useSession } from '@/lib/auth/auth-client';
import { useAuth } from '@/lib/auth/auth-context';

export type Step = 'welcome' | 'create' | 'join' | null;

export function useOnboarding() {
    const auth = useAuth();
    const { data: session } = useSession();
    const member = useActiveMember();

    const userId = session?.user?.id ?? null;

    const isUserLoading = auth.sessionPending || member.isPending;
    const isSignedOut = !auth.isAuthenticated && !auth.sessionPending;

    const hasOrganization = !!member.data?.organizationId;
    const isOnboarding =
        auth.isAuthenticated && !auth.hasActiveOrganization && !auth.isPending && !hasOrganization;

    const [step, setStep] = useState<Step>(isOnboarding ? 'welcome' : null);
    const open = step !== null;

    const onOpenChange = useCallback((open: boolean) => {
        if (!open) setStep(null);
    }, []);

    const goTo = useCallback((next: Step) => {
        setStep(next);
    }, []);

    useEffect(() => {
        if (isOnboarding && step === null) setStep('welcome');
        if (!isOnboarding && step !== null) setStep(null);
    }, [isOnboarding, step]);

    return {
        userId,
        step,
        open,
        goTo,
        onOpenChange,
        isOnboarding,
        isSignedOut,
        isUserLoading,
    };
}
