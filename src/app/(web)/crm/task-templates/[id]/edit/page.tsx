'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';

export default function TaskTemplateEditPage() {
    return (
        <div className="flex h-full flex-col p-6">
            <Button variant="tertiary" className="w-fit" asChild>
                <Link href="/crm/templates" className="text-label-xs flex items-center gap-1.5">
                    <ChevronLeft className="size-4" />
                    Back to Templates
                </Link>
            </Button>
            <div className="text-body-m text-sarge-gray-600 mt-6">
                Edit task template <span className="text-sarge-gray-800 font-medium">...</span>.
                (Editor coming in a follow-up.)
            </div>
        </div>
    );
}
