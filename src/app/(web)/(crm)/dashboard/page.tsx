'use client';

import { useSession, useActiveOrganization } from '@/lib/auth/auth-client';
import useFileUpload from '@/lib/hooks/useFileUpload';
import Image from 'next/image';
import WelcomeModal from './modal';

export default function DashboardPage() {
    const { data: session, isPending: sessionPending } = useSession();
    const { data: activeOrganization, isPending: orgPending } = useActiveOrganization();
    const { handleFileChange, loading, error, submitted, imageUrl } = useFileUpload('user');

    const isPending = sessionPending || orgPending;
    const showWelcomeModal = !activeOrganization?.id;

    if (!isPending && session?.user) {
        return (
            <div>
                {showWelcomeModal && <WelcomeModal />}
                <div className="">{session.user.name}</div>

                {/* THIS IS A SAMPLE OF HOW IMAGE UPLOAD WORKS FOR USERS / PLEASE REMOVE BEFORE WORKING ON THIS PAGE */}
                <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="mt-2"
                />

                {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {submitted && !error && !loading && (
                    <p className="mt-2 text-sm text-green-600">Success!</p>
                )}

                {imageUrl && <Image src={imageUrl} height={50} width={50} alt="image" />}
            </div>
        );
    } else {
        return <div className="">Loading...</div>;
    }
}
