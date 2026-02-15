'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { authClient } from '@/lib/auth/auth-client';
import { useAuthSession } from '@/lib/auth/auth-context';
import { Button } from '@/lib/components/ui/Button';
import { Mail, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

type InvitationData = {
    id: string;
    organizationId: string;
    organizationName?: string;
    email: string;
    role: string;
    status: string;
    expiresAt: string;
};

export default function AcceptInvitation() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams?.get('id') ?? null;

    const { isAuthenticated, isPending: sessionPending } = useAuthSession();

    const [invitation, setInvitation] = useState<InvitationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionPending) return;
        if (!isAuthenticated || !id) {
            setLoading(false);
            return;
        }

        async function fetchInvitation() {
            try {
                const result = await authClient.organization.getInvitation({
                    query: { id: id ?? '' },
                });

                if (result.data) {
                    setInvitation(result.data as unknown as InvitationData);
                }
            } catch {
                setError('Could not load invitation');
            } finally {
                setLoading(false);
            }
        }

        fetchInvitation();
    }, [id, isAuthenticated, sessionPending]);

    async function handleAccept() {
        if (!id) return;
        setAccepting(true);
        setError(null);

        try {
            await authClient.organization.acceptInvitation({ invitationId: id });
            if (invitation?.organizationId) {
                await authClient.organization.setActive({
                    organizationId: invitation.organizationId,
                });
            }
            setInvitation((prev) => (prev ? { ...prev, status: 'accepted' } : prev));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to accept invitation';
            setError(message);
        } finally {
            setAccepting(false);
        }
    }

    const isExpired = invitation?.expiresAt ? new Date(invitation.expiresAt) < new Date() : false;

    // Loading
    if (sessionPending || loading) {
        return (
            <CenteredCard>
                <Loader2 className="text-sarge-primary-500 size-8 animate-spin" />
                <p className="text-body-s text-sarge-gray-500">Loading invitation...</p>
            </CenteredCard>
        );
    }

    // Not signed in
    if (!isAuthenticated) {
        const redirectUrl = id
            ? `/signin?redirect=${encodeURIComponent(`/accept-invitation?id=${id}`)}`
            : '/signin';

        return (
            <CenteredCard>
                <StatusIcon variant="info" />
                <h1 className="text-display-xs text-sarge-gray-800">Sign in required</h1>
                <p className="text-body-s text-sarge-gray-600 text-center">
                    You need to sign in to accept this invitation. If you don&apos;t have an
                    account, you can create one first.
                </p>
                <div className="flex gap-3">
                    <Button variant="primary" asChild>
                        <Link href={redirectUrl} className="px-6 py-2">
                            Sign In
                        </Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href="/signup" className="px-6 py-2">
                            Sign Up
                        </Link>
                    </Button>
                </div>
            </CenteredCard>
        );
    }

    // No ID or invitation not found
    if (!id || !invitation) {
        return (
            <CenteredCard>
                <StatusIcon variant="error" />
                <h1 className="text-display-xs text-sarge-gray-800">
                    {!id ? 'Invalid invitation link' : 'Invitation not found'}
                </h1>
                <p className="text-body-s text-sarge-gray-600 text-center">
                    {!id
                        ? 'This link is missing required information. Please check the link in your email and try again.'
                        : 'This invitation could not be found. It may have been canceled or the link may be incorrect.'}
                </p>
            </CenteredCard>
        );
    }

    // Expired
    if (isExpired) {
        return (
            <CenteredCard>
                <StatusIcon variant="expired" />
                <h1 className="text-display-xs text-sarge-gray-800">Invitation expired</h1>
                <p className="text-body-s text-sarge-gray-600 text-center">
                    This invitation has expired. Please ask the organization administrator to send a
                    new one.
                </p>
            </CenteredCard>
        );
    }

    // Already accepted
    if (invitation.status === 'accepted') {
        return (
            <CenteredCard>
                <StatusIcon variant="success" />
                <h1 className="text-display-xs text-sarge-gray-800">Invitation accepted</h1>
                <p className="text-body-s text-sarge-gray-600 text-center">
                    You&apos;ve successfully joined the organization. Head to the dashboard to get
                    started.
                </p>
                <Button
                    variant="primary"
                    onClick={() => router.push('/crm/dashboard')}
                    className="px-6 py-2"
                >
                    Go to Dashboard
                </Button>
            </CenteredCard>
        );
    }

    // Pending — show accept UI
    return (
        <CenteredCard>
            <StatusIcon variant="info" />
            <h1 className="text-display-xs text-sarge-gray-800">You&apos;ve been invited</h1>

            <div className="bg-sarge-gray-50 border-sarge-gray-200 flex w-full flex-col gap-3 rounded-lg border p-4">
                <DetailRow
                    label="Organization"
                    value={invitation.organizationName ?? invitation.organizationId}
                />
                <DetailRow label="Role" value={formatRole(invitation.role)} />
                <DetailRow label="Email" value={invitation.email} />
            </div>

            {error && (
                <div className="border-sarge-error-200 bg-sarge-error-200 w-full rounded-lg border p-3">
                    <p className="text-sarge-error-700 text-body-xs">{error}</p>
                </div>
            )}

            <div className="flex w-full gap-3">
                <Button
                    variant="primary"
                    onClick={handleAccept}
                    disabled={accepting}
                    className="flex-1 px-6 py-2"
                >
                    {accepting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Accepting...
                        </>
                    ) : (
                        'Accept Invitation'
                    )}
                </Button>
            </div>
        </CenteredCard>
    );
}

// TODO these are temporary until we have UI from designs

function CenteredCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="flex w-full max-w-sm flex-col items-center gap-4">
                <Image
                    src="/HelmetLogoFull.png"
                    alt="Sarge"
                    width={160}
                    height={49}
                    priority
                    className="mb-2"
                />
                {children}
            </div>
        </div>
    );
}

function StatusIcon({ variant }: { variant: 'info' | 'success' | 'error' | 'expired' }) {
    const iconClass = 'size-10';

    switch (variant) {
        case 'success':
            return <CheckCircle className={`${iconClass} text-sarge-success-500`} />;
        case 'error':
            return <XCircle className={`${iconClass} text-sarge-error-400`} />;
        case 'expired':
            return <Clock className={`${iconClass} text-sarge-warning-500`} />;
        case 'info':
        default:
            return <Mail className={`${iconClass} text-sarge-primary-500`} />;
    }
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-label-s text-sarge-gray-600">{label}</span>
            <span className="text-body-s text-sarge-gray-800">{value}</span>
        </div>
    );
}

function formatRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
}
