'use client';

import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from './Modal';
import { Button } from '@/lib/components/Button';
import { ExternalLink, Import, X } from 'lucide-react';
import { DataTable } from '@/lib/components/DataTable';
import type { BatchAddCandidatesDTO } from '@/lib/schemas/candidate-pool.schema';
import { useUploadCSV } from '@/lib/hooks/useUploadCSV';

export type UploadCSVModalProps = {
    open: boolean;
    positionId: string;
    onOpenChange: (open: boolean) => void;
    onCreate: (candidates: BatchAddCandidatesDTO) => Promise<void>;
};

export default function UploadCSVModal({
    open,
    positionId,
    onOpenChange,
    onCreate,
}: UploadCSVModalProps) {
    const {
        selectedFile,
        isDragging,
        isUploading,
        candidates,
        step,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFileSelect,
        handleCreate,
        handleCancel,
    } = useUploadCSV(positionId);

    const onCreateClick = async () => {
        const shouldClose = await handleCreate(onCreate);
        if (shouldClose) {
            onOpenChange(false);
        }
    };

    const onCancelClick = () => {
        handleCancel();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="border-sarge-gray-200 w-[650px] !max-w-[95vw] gap-0 px-7 py-6"
                showCloseButton={false}
            >
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-label-m text-sarge-gray-800 font-medium">
                                Import CSV
                            </DialogTitle>
                            <a
                                href="/example-candidates.csv"
                                download="example-candidates.csv"
                                className="text-label-xs text-sarge-primary-600 hover:text-sarge-primary-700 flex items-center gap-2 px-0 py-2 pr-4 text-left font-medium transition-colors"
                            >
                                View example CSV
                                <ExternalLink className="size-5" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="text-label-xs text-sarge-primary-600 hover:text-sarge-primary-700 px-1 py-0 font-medium transition-colors">
                                Add details manually
                            </button>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="hover:bg-sarge-gray-100 rounded p-0.5 transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                    </div>

                    {step === 'uploadCSV' && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-sarge-gray-300 flex h-[252px] w-full cursor-pointer flex-col items-center justify-center gap-2.5 border-[1.5px] border-dashed transition-colors ${
                                isDragging ? 'bg-sarge-gray-50 border-sarge-primary-500' : ''
                            }`}
                        >
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="csv-upload"
                            />
                            <label
                                htmlFor="csv-upload"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2.5"
                            >
                                <Import className="text-sarge-gray-600 size-6" />
                                <p className="text-label-s text-sarge-gray-600 text-center font-medium">
                                    {selectedFile ? (
                                        <span className="text-sarge-gray-800">
                                            {selectedFile.name}
                                        </span>
                                    ) : (
                                        <>
                                            Drop CSV file here or{' '}
                                            <span className="text-sarge-primary-600">
                                                click to browse
                                            </span>
                                        </>
                                    )}
                                </p>
                            </label>
                        </div>
                    )}
                    {step === 'confirm' && (
                        <div className="flex flex-col gap-4">
                            <div className="">
                                <div className="text-lg font-bold">Preview</div>
                                <div className="text-sm font-light">
                                    {0} Candidates will be added
                                </div>
                            </div>
                            <div className="">{JSON.stringify(candidates, null, 2)}</div>
                            <DataTable columns={[]} data={[]} />
                        </div>
                    )}

                    <div className="flex w-full items-center justify-between">
                        <button
                            onClick={onCancelClick}
                            className="text-label-s text-sarge-primary-600 hover:text-sarge-primary-700 px-0 py-2 pr-4 text-left font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            variant="primary"
                            onClick={onCreateClick}
                            disabled={!selectedFile || isUploading}
                            className="h-9 w-[125px] px-4 py-2 disabled:opacity-50"
                        >
                            {isUploading
                                ? 'Uploading...'
                                : step === 'uploadCSV'
                                  ? 'Continue'
                                  : 'Create'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
