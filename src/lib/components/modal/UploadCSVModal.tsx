'use client';

import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from './Modal';
import { Button } from '@/lib/components/Button';
import { useState } from 'react';
import { ExternalLink, Import, X } from 'lucide-react';
import { DataTable } from '@/lib/components/DataTable';
import type { BatchAddCandidatesDTO } from '@/lib/schemas/candidate-pool.schema';

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [candidates, setCandidates] = useState<BatchAddCandidatesDTO | null>(null);
    const [step, setStep] = useState<'uploadCSV' | 'confirm'>('uploadCSV');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'text/csv') {
            setSelectedFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        }
    };

    const handleCreate = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            if (step === 'uploadCSV') {
                await uploadCSV(selectedFile);
                setStep('confirm');
            } else if (candidates) {
                await onCreate(candidates);
                setSelectedFile(null);
                setStep('uploadCSV');
                onOpenChange(false);
            } else {
                setError(new Error('no candidates'));
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        onOpenChange(false);
        setStep('uploadCSV');
    };

    const uploadCSV = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/position/${positionId}/candidates/csv`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                alert(await response.text());
            }
            const data = await response.json();
            setCandidates(data.data);

            setError(null);
        } finally {
            setIsUploading(false);
        }
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
                            onClick={handleCancel}
                            className="text-label-s text-sarge-primary-600 hover:text-sarge-primary-700 px-0 py-2 pr-4 text-left font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            variant="primary"
                            onClick={handleCreate}
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
