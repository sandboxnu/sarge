'use client';

import { useAuth } from '@/lib/auth/user-context';
import useFileUpload from '@/lib/hooks/useFileUpload';
import Image from 'next/image';
import WelcomeModal from './modal';

export default function DashboardPage() {
    const auth = useAuth();
    const { handleFileChange, loading, error, submitted, imageUrl } = useFileUpload('user');

    const showWelcomeModal = auth.user?.orgId === null || auth.user?.orgId === undefined;

    if (!auth.isPending && auth.user) {
        return (
            <div>
                {showWelcomeModal && <WelcomeModal />}
                <div className="">{auth.user.name}</div>

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
