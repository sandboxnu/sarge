'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';

type Invitation = {
    id: string;
    organizationId: string;
    email: string;
    role: string;
    status: string;
    expiresAt: string;
};

export default function AcceptInvitation() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id') ?? null;
    const [inv, setInv] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(false);

    //fetch invitation details on load
    useEffect(() => {
        if (!id) return;
        fetch(`/api/invitation?id=${encodeURIComponent(id)}`)
            .then((r) => r.json())
            .then((json) => setInv(json.data))
            .catch(() => setInv(null));
    }, [id]);

    async function accept() {
        if (!id) return;
        setLoading(true);
        try {
            const result = await authClient.organization.acceptInvitation({ invitationId: id });
            setInv((v) => (v ? { ...v, status: 'ACCEPTED' } : v));
            return result;
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    //TODO: super barebones lol.. idk how the design is supposed to look like so i wont add anything yet
    return (
        <div className="mx-auto mt-2 p-6">
            {inv ? (
                <div className="flex flex-col gap-2">
                    <p>
                        <strong>Organization:</strong> {inv.organizationId}
                    </p>
                    <p>
                        <strong>Role:</strong> {inv.role}
                    </p>
                    <p>
                        <strong>Status:</strong> {inv.status}
                    </p>
                </div>
            ) : (
                <div>Loading invitation...</div>
            )}

            <button
                onClick={accept}
                disabled={loading}
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                {loading ? 'Accepting' : 'Accept Invitation'}
            </button>
        </div>
    );
}
