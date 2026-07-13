'use client';

import { useRouter } from 'next/navigation';
import { ShieldUser } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';

export default function AdminOnboardingButton() {
    const router = useRouter();

    return (
        <Button
            variant="primary"
            onClick={() => router.push('/admin')}
            className="pointer-events-auto fixed bottom-6 left-6 z-[51] px-4"
        >
            <ShieldUser />
            Admin
        </Button>
    );
}
