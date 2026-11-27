'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth/auth-client';
import { useAuthSession } from '@/lib/auth/auth-context';
import { Button } from '@/lib/components/ui/Button';
import type { AcceptInvitation as AcceptInvitationData } from '@/lib/types/invitation.types';
import { getRoleLabel } from '@/lib/utils/roles.utils';
import { acceptInvitationAndActivate } from '@/lib/api/organizations';

export default function AcceptInvitation({ id, expired }: { id: string | null; expired: boolean }) {
    const router = useRouter();

    const { user, isAuthenticated, isPending: sessionPending } = useAuthSession();

    const [invitation, setInvitation] = useState<AcceptInvitationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionPending) return;
        if (!isAuthenticated || !id) {
            setLoading(false);
            return;
        }

        async function fetchInvitation() {
            setLoadError(null);
            try {
                const result = await authClient.organization.getInvitation({
                    query: { id: id ?? '' },
                });

                if (result.error) {
                    setLoadError(result.error.message ?? 'Could not load invitation');
                } else if (result.data) {
                    const data = result.data;
                    setInvitation({
                        id: data.id,
                        email: data.email,
                        organizationId: data.organizationId,
                        organizationName: data.organizationName,
                        role: data.role,
                        status: data.status,
                        inviterId: data.inviterId,
                        expiresAt: new Date(data.expiresAt),
                    });
                }
            } catch {
                setLoadError('Could not load invitation');
            } finally {
                setLoading(false);
            }
        }

        fetchInvitation();
    }, [id, isAuthenticated, sessionPending]);

    async function handleAccept() {
        if (!id || !invitation) return;
        setAccepting(true);
        setError(null);

        try {
            await acceptInvitationAndActivate(id, invitation.organizationId);
            setInvitation((prev) => (prev ? { ...prev, status: 'accepted' } : prev));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to accept invitation';
            setError(message);
        } finally {
            setAccepting(false);
        }
    }

    async function handleSwitchAccount() {
        await authClient.signOut();
        router.refresh();
    }

    if (sessionPending || loading) {
        return <div className="text-body-s text-sarge-gray-600 text-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        const redirect = id ? `?redirect=${encodeURIComponent(`/accept-invitation?id=${id}`)}` : '';

        return (
            <>
                <Heading title="You've been invited">
                    Sign in or create an account to accept this invitation.
                </Heading>
                <Button asChild variant="primary" className={PRIMARY_BUTTON}>
                    <Link href={`/signin${redirect}`}>Sign in</Link>
                </Button>
                <div className="mt-4 flex items-center justify-center gap-1 py-1">
                    <p className="text-label-xs text-sarge-gray-600">Don&apos;t have an account?</p>
                    <Link href={`/signup${redirect}`} className={TEXT_LINK}>
                        Sign up
                    </Link>
                </div>
            </>
        );
    }

    if (!id) {
        return (
            <Heading title="Link is invalid">
                This invitation link is missing information. Check the link in your email and try
                again.
            </Heading>
        );
    }

    // better-auth returns an error for expired, canceled, and wrong-account invitations
    if (!invitation) {
        return (
            <>
                <Heading title={expired ? 'Invitation expired' : "Can't open this invitation"}>
                    {expired
                        ? 'This invitation link has expired. Links and codes are valid for 24 hours.'
                        : `${loadError ?? 'Invitation not found'}.`}{' '}
                    You&apos;re signed in as{' '}
                    <span className="text-sarge-gray-800 font-medium">{user?.email}</span>.
                </Heading>

                <Button asChild variant="primary" className={PRIMARY_BUTTON}>
                    <Link href={`/accept-invitation/new-link?id=${id}`}>Send a new link</Link>
                </Button>

                <div className="mt-4 flex items-center justify-center gap-1 py-1">
                    <p className="text-label-xs text-sarge-gray-600">Invited with another email?</p>
                    <Button
                        type="button"
                        variant="link"
                        onClick={handleSwitchAccount}
                        className={`${TEXT_LINK} h-auto p-0`}
                    >
                        Switch account
                    </Button>
                </div>
            </>
        );
    }

    if (invitation.status === 'accepted') {
        return (
            <>
                <Heading title="You're in">
                    You&apos;ve joined{' '}
                    <span className="text-sarge-gray-800 font-medium">
                        {invitation.organizationName}
                    </span>
                    .
                </Heading>
                <Button asChild variant="primary" className={PRIMARY_BUTTON}>
                    <Link href="/crm/dashboard">Continue to Sarge</Link>
                </Button>
            </>
        );
    }

    return (
        <>
            <Heading title={`Join ${invitation.organizationName}`}>
                You&apos;ve been invited to join{' '}
                <span className="text-sarge-gray-800 font-medium">
                    {invitation.organizationName}
                </span>{' '}
                as a{' '}
                <span className="text-sarge-gray-800 font-medium">
                    {getRoleLabel(invitation.role)}
                </span>
                .
            </Heading>

            <Button
                type="button"
                variant="primary"
                onClick={handleAccept}
                disabled={accepting}
                className={PRIMARY_BUTTON}
            >
                {accepting ? 'Accepting...' : 'Accept invitation'}
            </Button>

            {error && <p className="text-sarge-error-700 text-body-xs mt-3 text-center">{error}</p>}
        </>
    );
}

const PRIMARY_BUTTON = 'text-label-s text-sarge-gray-50 h-11 w-full px-4';
const TEXT_LINK = 'text-label-xs text-sarge-primary-500 hover:underline';

export function Heading({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <h1 className="text-display-xs">{title}</h1>
            <p className="text-body-s text-sarge-gray-600">{children}</p>
        </div>
    );
}
