'use client';

import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import { AlertCircle, X } from 'lucide-react';
import type { AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import useCreateCandidateModal from '@/lib/hooks/useCreateCandidateModal';

export type CreateCandidateModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (candidate: AddApplicationWithCandidateDataDTO) => Promise<void>;
    onSwitchModal?: () => void;
};

export default function CreateCandidateModal({
    open,
    onOpenChange,
    onCreate,
    onSwitchModal,
}: CreateCandidateModalProps) {
    const {
        fullName,
        email,
        major,
        graduationYear,
        resume,
        linkedin,
        github,
        notes,

        setFullName,
        setEmail,
        setMajor,
        setGraduationYear,
        setResume,
        setLinkedin,
        setGithub,
        setNotes,

        isCreating,
        localError,
        fieldErrors,

        handleCreate,
        handleCancel,
    } = useCreateCandidateModal({
        open,
        onOpenChange,
        onCreate,
        onSwitchModal,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[900px] !max-w-[750px] gap-0 px-8 py-6"
                showCloseButton={false}
            >
                <div className="flex h-full flex-col items-center justify-between">
                    <div className="mb-6 flex w-full items-start justify-between">
                        <DialogTitle className="text-display-xs text-sarge-gray-800 font-bold">
                            Add new candidate
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onSwitchModal}
                                className="text-label-xs text-sarge-primary-600 px-1 font-medium transition-colors hover:cursor-pointer"
                            >
                                Import CSV
                            </button>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="hover:bg-sarge-gray-100 hover:bg-sarge-gray-200 rounded p-0.5 transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                    </div>

                    {localError && (
                        <div className="text-sarge-error-700 mb-4 flex w-full items-center gap-2 text-sm">
                            <AlertCircle className="size-4" />
                            {localError}
                        </div>
                    )}

                    <div className="mb-6 flex w-full flex-col gap-6">
                        <div className="flex flex-col gap-[10px]">
                            <div className="flex w-full items-center justify-between">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Full Name<span className="text-sarge-gray-700">*</span>
                                </FieldLabel>
                                <Input
                                    placeholder="Full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    aria-invalid={fieldErrors.fullName || undefined}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Major<span className="text-sarge-gray-700">*</span>
                                </FieldLabel>
                                <Input
                                    placeholder="Major"
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    aria-invalid={fieldErrors.major || undefined}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Email<span className="text-sarge-gray-700">*</span>
                                </FieldLabel>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-invalid={fieldErrors.email || undefined}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Graduation Year
                                </FieldLabel>
                                <Input
                                    placeholder="Graduation year"
                                    value={graduationYear}
                                    onChange={(e) => setGraduationYear(e.target.value)}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Resume
                                </FieldLabel>
                                <Input
                                    type="url"
                                    placeholder="Paste link"
                                    value={resume}
                                    onChange={(e) => setResume(e.target.value)}
                                    aria-invalid={fieldErrors.resume || undefined}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    LinkedIn
                                </FieldLabel>
                                <Input
                                    type="url"
                                    placeholder="Paste link"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    aria-invalid={fieldErrors.linkedin || undefined}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    GitHub
                                </FieldLabel>
                                <Input
                                    type="url"
                                    placeholder="Paste link"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    aria-invalid={fieldErrors.github || undefined}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full flex-col gap-2">
                                <FieldLabel className="text-label-m text-sarge-gray-700 font-medium uppercase">
                                    Notes
                                </FieldLabel>
                                <textarea
                                    placeholder="Notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-sarge-gray-50 text-sarge-gray-800 border-sarge-gray-200 placeholder:text-sarge-gray-500 hover:border-sarge-gray-300 focus:border-sarge-gray-300 min-h-[120px] w-full resize-none rounded-lg border px-3 py-2 transition-colors focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-label-s text-sarge-primary-600 hover:text-sarge-primary-700 px-0 py-2 font-medium transition-colors hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleCreate}
                            disabled={isCreating}
                            className="h-9 w-[125px] px-4 py-2"
                        >
                            {isCreating ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
