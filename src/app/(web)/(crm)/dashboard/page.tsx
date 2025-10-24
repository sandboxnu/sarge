'use client';

import { useAuth } from '@/lib/auth/auth-client';
import useFileUpload from '../../hooks/useFileUpload';
import Image from 'next/image';

export default function DashboardPage() {
    const auth = useAuth();
    const { handleFileChange, loading, error, submitted, imageUrl } = useFileUpload('user');

    if (!auth.isPending && auth.user?.id !== null) {
        return (
            <div>
                <div className="">{auth.user.name}</div>

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
