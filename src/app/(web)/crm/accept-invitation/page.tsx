'use client';

import { useEffect, useState, use } from 'react';

type Invitation = {
    id: string;
    organizationId: string;
    email: string;
    role: string;
    status: string;
    expiresAt: string;
};

export default function AcceptInvitationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [inv, setInv] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(false);

    //fetch invitation details on load
    useEffect(() => {
        if (!id) return;
        fetch(`/api/invitations/accept?id=${encodeURIComponent(id)}`)
            .then((r) => r.json())
            .then((data) => setInv(data))
            .catch(() => setInv(null));
    }, [id]);

    async function accept() {
        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/invitations/accept?id=${encodeURIComponent(id)}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok || !data?.ok) throw new Error('Accept invitation failed');
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
