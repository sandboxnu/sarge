'use client';

import { useRouter } from 'next/navigation';
import { ShieldUser } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';

/**
 * z-[51] is needed bc we want the button to be above the modal layering of (z-50)
 * we set pointer-events-auto which re-enables clicks
 * since an open modal sets pointer-events: none on the body.
 */
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
