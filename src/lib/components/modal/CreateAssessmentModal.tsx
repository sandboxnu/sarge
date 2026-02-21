'use client';

import dynamic from 'next/dynamic';
import { Dialog, DialogContent } from '@/lib/components/ui/Modal';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import { useCreateAssessmentTemplateModal } from '@/lib/hooks/useCreateAssessmentTemplateModal';
import Image from 'next/image';

const CreateAssessmentModalEditor = dynamic(() => import('../core/CreateAssessmentModalEditor'), {
    ssr: false,
});

export type CreateAssessmentTemplateModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function CreateAssessmentTemplateModal({
    open,
    onOpenChange,
}: CreateAssessmentTemplateModalProps) {
    const {
        name,
        isLoading,
        localError,
        handleCreate,
        handleCancel,
        handleNameChange,
        handleNotesChange,
    } = useCreateAssessmentTemplateModal(onOpenChange);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[750px] min-w-[750px] px-9 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <Image
                            src="/CreateOrgLoading.gif"
                            alt="Loading..."
                            width={100}
                            height={100}
                            unoptimized
                        />
                        <p className="text-sarge-gray-600 text-sm">
                            Creating assessment template...
                        </p>
                    </div>
                ) : (
                    <div className="text-sarge-gray-800 flex min-w-0 flex-col gap-6">
                        <div className="text-lg font-medium">Create new assessment template</div>
                        <div className="flex w-full min-w-0 flex-col gap-2">
                            <h3 className="text-md font-medium">Assessment name</h3>
                            <Input
                                className={`w-full p-3 ${localError ? 'border-red-500' : ''}`}
                                placeholder="Software Engineering"
                                value={name}
                                onChange={handleNameChange}
                            />
                            {localError && <p className="text-sm text-red-500">{localError}</p>}
                        </div>
                        <div className="flex w-full min-w-0 flex-col gap-2">
                            <h3 className="text-md font-medium">Internal notes</h3>
                            <CreateAssessmentModalEditor onNotesChange={handleNotesChange} />
                        </div>
                        <div className="flex justify-between">
                            <Button variant={'link'} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button className="px-4 py-2" onClick={handleCreate}>
                                Create
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
