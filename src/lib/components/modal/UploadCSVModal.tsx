'use client';

import { useRef } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { ExternalLink, FileText, Trash, X, Download, Users } from 'lucide-react';
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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

    const formatFileSize = (bytes: number) => {
        if (!Number.isFinite(bytes)) return '';
        const mb = bytes / (1024 * 1024);
        if (mb >= 1) {
            return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
        }
        const kb = bytes / 1024;
        return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB`;
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={`border-sarge-gray-200 !max-w-[95vw] gap-0 px-7 py-6 ${
                    step === 'confirm' ? 'w-[1200px]' : 'w-[650px]'
                }`}
                showCloseButton={false}
            >
                <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-label-m text-sarge-gray-800 font-bold">
                                Import candidates
                            </DialogTitle>
                            <div className="text-label-xs text-sarge-gray-600 flex items-center gap-2">
                                <span>Upload a CSV to import candidates.</span>
                                <a
                                    href="/example-candidates.csv"
                                    download="example-candidates.csv"
                                    className="text-label-xs text-sarge-primary-600 hover:text-sarge-primary-700 flex items-center gap-2 px-0 py-2 pr-4 text-left font-medium transition-colors"
                                >
                                    Download sample CSV
                                    <Download className="size-4" />
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="hover:bg-sarge-gray-200 rounded p-0.5 transition-colors"
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
                            onClick={openFilePicker}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openFilePicker();
                                }
                            }}
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
                                ref={fileInputRef}
                            />
                            <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-5">
                                <div className="flex flex-col items-center gap-2.5 text-center">
                                    <Users className="text-sarge-gray-600 size-5" />
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        {selectedFile ? (
                                            <span className="text-sarge-gray-800">
                                                {selectedFile.name}
                                            </span>
                                        ) : (
                                            <>
                                                <p className="text-label-s text-sarge-gray-800 font-bold">
                                                    Drag CSV here to import candidates
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {!selectedFile && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openFilePicker();
                                        }}
                                        className="h-9 rounded-md px-4"
                                    >
                                        Browse files
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                    {step === 'confirm' && (
                        <div className="flex flex-col gap-4">
                            {selectedFile && (
                                <div className="border-sarge-gray-200 bg-sarge-gray-50 flex items-center justify-between rounded-md border px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-sarge-gray-600 mt-[2px] size-4 self-start" />
                                        <div className="flex flex-col">
                                            <span className="text-label-s text-sarge-gray-800 font-medium">
                                                {selectedFile.name}
                                            </span>
                                            <span className="text-label-xs text-sarge-gray-600">
                                                {formatFileSize(selectedFile.size)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="text-sarge-gray-600 hover:text-sarge-gray-800 transition-colors hover:cursor-pointer"
                                        aria-label="Remove file"
                                    >
                                        <Trash className="size-5" />
                                    </button>
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <div className="text-lg font-bold">Preview</div>
                                <div className="text-sm font-light">
                                    {candidates?.length ?? 0} candidates
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
                            className="text-label-s text-sarge-primary-600 hover:text-sarge-primary-700 px-0 py-2 pr-4 text-left font-medium transition-colors hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <Button
                            variant="primary"
                            onClick={onCreateClick}
                            disabled={!selectedFile || isUploading}
                            className="h-9 w-[125px] px-4 py-2 disabled:opacity-50"
                        >
                            {isUploading ? 'Uploading...' : 'Import'}
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
    const ensureAbsoluteUrl = (url?: string | null) => {
        if (!url || url === '-') return '';
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    };

    const HeaderLabel = ({ children }: { children: string }) => (
        <span className="text-body-s text-sarge-gray-700 font-normal tracking-[0.406px] normal-case">
            {children}
        </span>
    );

    const columns: ColumnDef<AddApplicationWithCandidateDataDTO>[] = [
        {
            accessorKey: 'name',
            header: () => <HeaderLabel>NAME/MAJOR</HeaderLabel>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                        {row.original.name}
                    </span>
                    <span className="text-body-xs text-sarge-gray-800 font-normal tracking-[0.406px]">
                        {row.original.major && row.original.major !== '-'
                            ? row.original.major
                            : '—'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'graduationDate',
            header: () => <HeaderLabel>GRAD YEAR</HeaderLabel>,
            cell: ({ row }) => (
                <span className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                    {row.original.graduationDate && row.original.graduationDate !== '-'
                        ? row.original.graduationDate
                        : '—'}
                </span>
            ),
        },
        {
            accessorKey: 'email',
            header: () => <HeaderLabel>EMAIL</HeaderLabel>,
            cell: ({ row }) => (
                <span className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                    {row.original.email}
                </span>
            ),
        },
        {
            accessorKey: 'resumeUrl',
            header: () => <HeaderLabel>RESUME</HeaderLabel>,
            cell: ({ row }) => {
                const url = ensureAbsoluteUrl(row.original.resumeUrl);
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label-s text-sarge-primary-500 hover:text-sarge-primary-600 inline-flex items-center gap-1.5 font-medium tracking-[0.406px]"
                    >
                        Link to resume <ExternalLink className="size-4" />
                    </a>
                ) : (
                    <span className="text-body-s text-sarge-gray-600">—</span>
                );
            },
        },
        {
            accessorKey: 'githubUrl',
            header: () => <HeaderLabel>GITHUB</HeaderLabel>,
            cell: ({ row }) => {
                const url = ensureAbsoluteUrl(row.original.githubUrl);
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label-s text-sarge-primary-500 hover:text-sarge-primary-600 inline-flex items-center gap-1.5 font-medium tracking-[0.406px]"
                    >
                        Link to GitHub <ExternalLink className="size-4" />
                    </a>
                ) : (
                    <span className="text-body-s text-sarge-gray-600">—</span>
                );
            },
        },
        {
            accessorKey: 'linkedinUrl',
            header: () => <HeaderLabel>LINKEDIN</HeaderLabel>,
            cell: ({ row }) => {
                const url = ensureAbsoluteUrl(row.original.linkedinUrl);
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-label-s text-sarge-primary-500 hover:text-sarge-primary-600 inline-flex items-center gap-1.5 font-medium tracking-[0.406px]"
                    >
                        Link to LinkedIn <ExternalLink className="size-4" />
                    </a>
                ) : (
                    <span className="text-body-s text-sarge-gray-600">—</span>
                );
            },
        },
    ];

    return (
        <div className="candidate-table border-sarge-gray-200 bg-sarge-gray-0 border">
            <DataTable columns={columns} data={candidates} />
            <style jsx>{`
                .candidate-table :global(thead) {
                    background: var(--sarge-gray-50);
                }
            `}</style>
        </div>
    );
}
