import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

function useAdminPage() {
    const router = useRouter();
    const { isSuperUser, sessionPending } = useAuth();

    useEffect(() => {
        if (!sessionPending && !isSuperUser) {
            router.replace('/crm/dashboard');
        }
    }, [sessionPending, isSuperUser, router]);

    return {
        isSuperUser,
        isLoading: sessionPending,
    };
}

export default useAdminPage;
