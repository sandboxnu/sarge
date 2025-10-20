'use client';

import { useAuth } from '@/lib/auth/auth-client';

export default function DashboardPage() {
    const auth = useAuth();

    if (!auth.isPending && auth.user?.id !== null) {
        return <div className="">{auth.user.name}</div>;
    } else {
        return <div className="">Loading...</div>;
    }
}
