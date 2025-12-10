import { useState } from 'react';
import type { AddCandidateWithDataDTO } from '@/lib/schemas/candidate-pool.schema';

export function useUploadCSV(positionId: string) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [candidates, setCandidates] = useState<AddCandidateWithDataDTO[] | null>(null);
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

    const handleCreate = async (
        onCreate: (candidates: AddCandidateWithDataDTO[]) => Promise<void>
    ) => {
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
                return true;
            } else {
                setError(new Error('no candidates'));
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
        return false;
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setStep('uploadCSV');
    };

    return {
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
    };
}
