'use client';

import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import useTaskTemplateEditPage from '@/lib/hooks/useTaskTemplateEditPage';

export default function TaskTemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { taskTemplate, isLoading } = useTaskTemplateEditPage(id);

    if (isLoading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                <Image src="/CreateOrgLoading.gif" alt="Loading GIF" width={66} height={66} />

                <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide">
                    Opening task template editor...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex items-center gap-2 border-b px-5 py-4">
                <button
                    onClick={() => router.push('/crm/templates')}
                    className="hover:bg-sarge-gray-100 rounded-lg p-2"
                >
                    <ChevronLeft className="size-5" />
                </button>
                <h1 className="text-xl font-bold">{taskTemplate?.title}</h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 bg-yellow-100 p-4">{/* Tabs and Content Here */}</div>

                <div className="flex w-2/3 flex-col">
                    <div className="flex-1 bg-red-100 p-4">{/* Editor Here */}</div>

                    <div className="flex-1 bg-blue-100 p-4">{/* Tests Here */}</div>
                </div>
            </div>
        </div>
    );
}
