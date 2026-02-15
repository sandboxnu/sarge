'use client';

import { useRef, type ReactNode } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import Image from 'next/image';
import { Download, FileText, Trash, X, Users } from 'lucide-react';
import { DataTable } from '@/lib/components/ui/DataTable';
import { LinkButton } from '@/lib/components/ui/LinkButton';
import type { AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { useUploadCSV } from '@/lib/hooks/useUploadCSV';
import type { ColumnDef } from '@tanstack/react-table';

export type UploadCSVModalProps = {
    open: boolean;
    positionId: string;
    onOpenChange: (open: boolean) => void;
    onCreate: (candidates: AddApplicationWithCandidateDataDTO[]) => Promise<void>;
};

export default function UploadCSVModal({
    open,
    positionId,
    onOpenChange,
    onCreate,
}: UploadCSVModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const {
        selectedFile,
        isDragging,
        isUploading,
        error,
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

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={`border-sarge-gray-200 max-h-[85vh] !max-w-[85vw] gap-0 overflow-hidden px-7 py-6 ${
                    step === 'confirm' ? 'w-[1200px]' : 'w-[650px]'
                }`}
                showCloseButton={false}
            >
                <div className="flex h-full w-full flex-col gap-4">
                    <div className="flex w-full items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-label-m text-sarge-gray-800 font-bold">
                                Import candidates
                            </DialogTitle>
                            <div className="text-label-xs text-sarge-gray-800 flex items-center gap-2">
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

                    {step === 'uploadCSV' && error && (
                        <ErrorFileCallout
                            file={selectedFile}
                            message={error.message || 'CSV not formatted correctly'}
                            onDismiss={handleCancel}
                        />
                    )}
                    {step === 'uploadCSV' && !error && (
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
                    {step === 'uploading' && (
                        <div className="flex flex-col gap-4">
                            <UploadedFileCallout
                                file={selectedFile}
                                fallbackName="File name.csv"
                                fallbackSize={15 * 1024 * 1024}
                                actionLabel="Cancel upload"
                                onAction={handleCancel}
                                actionIcon={<X className="size-5" />}
                            />
                            <div className="border-sarge-gray-300 flex h-[252px] w-full flex-col items-center justify-center gap-5 border-[1.5px] border-dashed">
                                <Image
                                    src="/CreateOrgLoading.gif"
                                    alt="Uploading file"
                                    width={66}
                                    height={66}
                                />
                                <p className="text-label-s text-sarge-gray-800 font-bold">
                                    Uploading file...
                                </p>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleCancel}
                                    className="h-9 w-[125px] gap-2 rounded-md px-4 py-2"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                    {step === 'confirm' && (
                        <div className="flex min-h-0 flex-col gap-4">
                            {selectedFile && (
                                <UploadedFileCallout
                                    file={selectedFile}
                                    actionLabel="Remove file"
                                    onAction={handleCancel}
                                    actionIcon={<Trash className="size-5" />}
                                />
                            )}
                            <div className="flex flex-col gap-1">
                                <div className="text-lg font-bold">Preview</div>
                                <div className="text-body-s text-sarge-gray-800 font-normal tracking-[0.406px]">
                                    {candidates?.length ?? 0} candidates
                                </div>
                            </div>
                            <div className="max-h-[calc(85vh-320px)] overflow-auto">
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
                            disabled={!selectedFile || isUploading || Boolean(error)}
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

    const getLinkLabel = (url: string, fallback: string) => {
        if (!url) return fallback;
        try {
            const cleaned = url.split('?')[0]?.split('#')[0] ?? '';
            const lastSegment = cleaned.split('/').filter(Boolean).pop();
            if (lastSegment) return decodeURIComponent(lastSegment);
            return fallback;
        } catch {
            return fallback;
        }
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
                    <LinkButton
                        href={url}
                        label={getLinkLabel(row.original.resumeUrl ?? '', 'resume')}
                    />
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
                    <LinkButton
                        href={url}
                        label={getLinkLabel(row.original.githubUrl ?? '', 'github')}
                    />
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
                    <LinkButton
                        href={url}
                        label={getLinkLabel(row.original.linkedinUrl ?? '', 'linkedin')}
                    />
                ) : (
                    <span className="text-body-s text-sarge-gray-600">—</span>
                );
            },
        },
    ];

    return (
        <div className="candidate-table border-sarge-gray-200 bg-sarge-gray-0 border">
            <DataTable columns={columns} data={candidates} />
            <style>{`
                .candidate-table :global(thead) {
                    background: var(--sarge-gray-50);
                }
            `}</style>
        </div>
    );
}

function ErrorFileCallout({
    file,
    message,
    onDismiss,
}: {
    file: File | null;
    message: string;
    onDismiss: () => void;
}) {
    return (
        <div className="border-sarge-error-400 flex items-center justify-between rounded-md border px-4 py-3">
            <div className="flex items-start gap-3">
                <FileText className="text-sarge-error-700 mt-[2px] size-4" />
                <div className="flex flex-col">
                    <span className="text-label-s text-sarge-error-700 font-medium">
                        {file?.name ?? 'File name.csv'}
                    </span>
                    <span className="text-label-xs text-sarge-error-700">{message}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={onDismiss}
                className="text-sarge-error-700 transition-opacity hover:cursor-pointer hover:opacity-80"
                aria-label="Dismiss error"
            >
                <X className="size-5" />
            </button>
        </div>
    );
}

function UploadedFileCallout({
    file,
    fallbackName,
    fallbackSize,
    actionLabel,
    onAction,
    actionIcon,
}: {
    file: File | null;
    fallbackName?: string;
    fallbackSize?: number;
    actionLabel: string;
    onAction: () => void;
    actionIcon: ReactNode;
}) {
    const fileName = file?.name ?? fallbackName ?? '';
    const fileSize = file?.size ?? fallbackSize;
    return (
        <div className="border-sarge-gray-200 bg-sarge-gray-50 flex items-center justify-between rounded-md border px-4 py-3">
            <div className="flex items-center gap-3">
                <FileText className="text-sarge-gray-600 mt-[2px] size-4 self-start" />
                <div className="flex flex-col">
                    <span className="text-label-s text-sarge-gray-800 font-medium">{fileName}</span>
                    <span className="text-label-xs text-sarge-gray-600">
                        {formatFileSize(fileSize)}
                    </span>
                </div>
            </div>
            <button
                type="button"
                onClick={onAction}
                className="text-sarge-gray-600 hover:text-sarge-gray-800 transition-colors hover:cursor-pointer"
                aria-label={actionLabel}
            >
                {actionIcon}
            </button>
        </div>
    );
}

function formatFileSize(bytes?: number) {
    if (!Number.isFinite(bytes)) return '';
    const mb = (bytes ?? 0) / (1024 * 1024);
    if (mb >= 1) {
        return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`;
    }
    const kb = (bytes ?? 0) / 1024;
    return `${kb >= 10 ? Math.round(kb) : kb.toFixed(1)} KB`;
}
