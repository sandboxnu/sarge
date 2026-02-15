'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import useTaskTemplateEditPage from '@/lib/hooks/useTaskTemplateEditPage';
import TestCaseEditor from '@/lib/components/core/TestCaseEditor';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/lib/components/ui/Button';
import TaskEditorSidebar from '@/lib/components/core/TaskEditorSidebar';

export default function TaskTemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const {

        title,
        publicTestCases,
        setPublicTestCases,
        privateTestCases,
        setPrivateTestCases,

        isLoading,
        setTitle,
        description,
        setDescription,
        tags,
        setTags,
        availableTags,
        setAvailableTags,
        languages,
        setLanguages,
        taskTemplate,
    } = useTaskTemplateEditPage(id);

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
            <div className="flex items-center justify-between gap-2 border-b px-5 py-4">
                <div className="flex items-center">
                    <Button
                        variant="icon"
                        onClick={() => router.push('/crm/templates')}
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-xl font-bold">{title}</h1>
                </div>
                <Button variant="secondary" className="px-4 py-2">
                    Save Changes
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="h-full min-h-0 w-1/3 min-w-0">
                    <TaskEditorSidebar
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        tags={tags}
                        setTags={setTags}
                        availableTags={availableTags}
                        setAvailableTags={setAvailableTags}
                        languages={languages}
                        setLanguages={setLanguages}
                    />
                </div>

                <div className="flex w-2/3 flex-col">
                    <div className="flex-1 bg-red-100 p-4">{/* Editor Here */}</div>

                    <TestCaseEditor
                        publicTestCases={publicTestCases}
                        setPublicTestCases={setPublicTestCases}
                        privateTestCases={privateTestCases}
                        setPrivateTestCases={setPrivateTestCases}
                    />
                </div>
            </div>
        </div>
    );
}
