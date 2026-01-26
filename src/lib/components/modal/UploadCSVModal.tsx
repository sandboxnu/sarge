'use client';

import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { ExternalLink, Import, X } from 'lucide-react';
import { DataTable } from '@/lib/components/ui/DataTable';
import type { AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { useUploadCSV } from '@/lib/hooks/useUploadCSV';
import type { ColumnDef } from '@tanstack/react-table';

export type UploadCSVModalProps = {
    open: boolean;
    positionId: string;
    onOpenChange: (open: boolean) => void;
    onCreate: (candidates: AddApplicationWithCandidateDataDTO[]) => Promise<void>;
    onSwitchModal?: () => void;
};

export default function UploadCSVModal({
    open,
    positionId,
    onOpenChange,
    onCreate,
    onSwitchModal,
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

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleCancel();
        }
        onOpenChange(open);
    };

    const onCancelClick = () => {
        handleCancel();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={`!max-w-[95vw] gap-0 border-sarge-gray-200 px-7 py-6 ${
                    step === 'confirm' ? 'w-[1200px]' : 'w-[650px]'
                }`}
                showCloseButton={false}
            >
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-label-m font-medium text-sarge-gray-800">
                                Import CSV
                            </DialogTitle>
                            <a
                                href="/example-candidates.csv"
                                download="example-candidates.csv"
                                className="text-label-xs flex items-center gap-2 px-0 py-2 pr-4 text-left font-medium text-sarge-primary-600 transition-colors hover:text-sarge-primary-700"
                            >
                                View example CSV
                                <ExternalLink className="size-5" />
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onSwitchModal}
                                className="text-label-xs px-1 py-0 font-medium text-sarge-primary-600 transition-colors hover:cursor-pointer hover:text-sarge-primary-700"
                            >
                                Add details manually
                            </button>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="rounded p-0.5 transition-colors hover:bg-sarge-gray-200"
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
                            className={`flex h-[252px] w-full cursor-pointer flex-col items-center justify-center gap-2.5 border-[1.5px] border-dashed border-sarge-gray-300 transition-colors ${
                                isDragging ? 'border-sarge-primary-500 bg-sarge-gray-50' : ''
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
                                <Import className="size-6 text-sarge-gray-600" />
                                <p className="text-label-s text-center font-medium text-sarge-gray-600">
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
                                    {candidates?.length} Candidates will be added
                                </div>
                            </div>
                            <div className="max-h-[500px] overflow-y-auto">
                                <UploadCandidateTable candidates={candidates ?? []} />
                            </div>
                        </div>
                    )}

                    <div className="flex w-full items-center justify-between">
                        <button
                            onClick={onCancelClick}
                            className="text-label-s px-0 py-2 pr-4 text-left font-medium text-sarge-primary-600 transition-colors hover:cursor-pointer hover:text-sarge-primary-700"
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

function UploadCandidateTable({
    candidates,
}: {
    candidates: AddApplicationWithCandidateDataDTO[];
}) {
    const columns: ColumnDef<AddApplicationWithCandidateDataDTO>[] = [
        {
            accessorKey: 'name',
            header: 'NAME/MAJOR',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="text-lg text-sarge-gray-800">{row.original.name}</span>
                    <span className="text-sm text-sarge-gray-600">
                        {row.original.major && row.original.major !== '-'
                            ? row.original.major
                            : 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'EMAIL',
            cell: ({ row }) => (
                <span className="text-sm text-sarge-gray-800">{row.original.email}</span>
            ),
        },
        {
            accessorKey: 'graduationDate',
            header: 'GRADUATION DATE',
            cell: ({ row }) => (
                <span className="text-sm text-sarge-gray-800">
                    {row.original.graduationDate && row.original.graduationDate !== '-'
                        ? row.original.graduationDate
                        : 'N/A'}
                </span>
            ),
        },
        {
            accessorKey: 'resumeUrl',
            header: 'RESUME',
            cell: ({ row }) => {
                const url = row.original.resumeUrl;
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sarge-primary-500 hover:text-sarge-primary-600"
                    >
                        Link to Resume <ExternalLink className="size-4" />
                    </a>
                ) : (
                    'N/A'
                );
            },
        },
        {
            accessorKey: 'linkedinUrl',
            header: 'LINKEDIN',
            cell: ({ row }) => {
                const url = row.original.linkedinUrl;
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sarge-primary-500 hover:text-sarge-primary-600"
                    >
                        Link to LinkedIn <ExternalLink className="size-4" />
                    </a>
                ) : (
                    'N/A'
                );
            },
        },
        {
            accessorKey: 'githubUrl',
            header: 'GITHUB',
            cell: ({ row }) => {
                const url = row.original.githubUrl;
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sarge-primary-500 hover:text-sarge-primary-600"
                    >
                        Link to GitHub <ExternalLink className="size-4" />
                    </a>
                ) : (
                    'N/A'
                );
            },
        },
    ];

    return <DataTable columns={columns} data={candidates} />;
}
