'use client';

import useAdminPage from '@/lib/hooks/useAdminPage';

export default function AdminPage() {
    const { isSuperUser, isLoading } = useAdminPage();

    if (isLoading) return <div>Loading...</div>;
    if (!isSuperUser) return null;

    return <div>Admin Dashboard Coming Soon</div>;
}
