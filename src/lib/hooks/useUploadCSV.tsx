import { useState } from 'react';
import { type AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { csvCreateCandidates } from '@/lib/api/positions';
import { toast } from 'sonner';

export function useUploadCSV(positionId: string) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [candidates, setCandidates] = useState<AddApplicationWithCandidateDataDTO[] | null>(null);
    const [step, setStep] = useState<'uploadCSV' | 'confirm'>('uploadCSV');

    const isCsvFile = (file: File) =>
        file.type.toLowerCase().includes('csv') || file.name.toLowerCase().endsWith('.csv');

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
        if (files.length > 0 && isCsvFile(files[0])) {
            void handleSelectedFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && isCsvFile(files[0])) {
            void handleSelectedFile(files[0]);
        }
    };

    const uploadCSV = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const candidates = await csvCreateCandidates(positionId, formData);
            setCandidates(candidates);

            setError(null);
            return true;
        } catch (error) {
            setError(error as Error);
            toast.error('Error uploading CSV');
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSelectedFile = async (file: File) => {
        setSelectedFile(file);
        const uploaded = await uploadCSV(file);
        if (uploaded) {
            setStep('confirm');
        }
    };

    const handleCreate = async (
        onCreate: (candidates: AddApplicationWithCandidateDataDTO[]) => Promise<void>
    ) => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            if (step === 'uploadCSV') {
                const uploaded = await uploadCSV(selectedFile);
                if (uploaded) {
                    setStep('confirm');
                }
            } else if (candidates) {
                await onCreate(candidates);
                setSelectedFile(null);
                setStep('uploadCSV');
                return true;
            } else {
                setError(new Error('no candidates'));
            }
        } catch (error) {
            setError(error as Error);
        } finally {
            setIsUploading(false);
        }
        return false;
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setCandidates(null);
        setError(null);
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
