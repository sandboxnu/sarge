'use client';

import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle } from './Modal';
import { FieldLabel } from '@/lib/components/Field';
import { Input } from '@/lib/components/Input';
import { Button } from '@/lib/components/Button';
import { useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import type { AddCandidateWithDataDTO } from '@/lib/schemas/candidate-pool.schema';

export type CreateCandidateModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (candidate: AddCandidateWithDataDTO) => Promise<void>;
    onSwitchModal?: () => void;
};

export default function CreateCandidateModal({
    open,
    onOpenChange,
    onCreate,
    onSwitchModal,
}: CreateCandidateModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [major, setMajor] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [resume, setResume] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleCreate = async () => {
        if (!fullName.trim()) {
            setLocalError('Full name is required');
            return;
        }
        if (!email.trim()) {
            setLocalError('Email is required');
            return;
        }

        setIsCreating(true);
        setLocalError(null);
        try {
            await onCreate({
                name: fullName,
                email,
                ...(major && { major }),
                ...(graduationYear && { graduationDate: graduationYear }),
                ...(resume && { resumeUrl: resume }),
                ...(linkedin && { linkedinUrl: linkedin }),
                ...(github && { githubUrl: github }),
            });
            toast.success('Candidate added successfully.');
            setFullName('');
            setEmail('');
            setMajor('');
            setGraduationYear('');
            setResume('');
            setLinkedin('');
            setGithub('');
            onOpenChange(false);
        } catch {
            const errorMsg = 'Failed to add candidate. Please try again.';
            setLocalError(errorMsg);
            toast.error('Creation failed', {
                description: errorMsg,
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleCancel = () => {
        setFullName('');
        setEmail('');
        setMajor('');
        setGraduationYear('');
        setResume('');
        setLinkedin('');
        setGithub('');
        setLocalError(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[900px] !max-w-[750px] gap-0 px-8 py-6"
                showCloseButton={true}
            >
                <div className="flex h-full flex-col items-center justify-between">
                    <div className="mb-6 flex w-full items-start justify-between">
                        <DialogTitle className="text-display-xs text-sarge-gray-800 font-bold">
                            Add new candidate
                        </DialogTitle>
                        <button
                            onClick={onSwitchModal}
                            className="text-label-xs text-sarge-primary-600 hover:text-sarge-primary-700 px-1 font-medium transition-colors"
                        >
                            Import CSV
                        </button>
                    </div>

                    <div className="mb-6 flex w-full flex-col gap-6">
                        <div className="flex flex-col gap-[10px]">
                            <div className="flex w-full items-center justify-between">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Full Name
                                </FieldLabel>
                                <Input
                                    placeholder="Full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Major
                                </FieldLabel>
                                <Input
                                    placeholder="Major"
                                    value={major}
                                    onChange={(e) => setMajor(e.target.value)}
                                    className="h-11 flex-1"
                                />
                            </div>

                            <div className="flex w-full items-center justify-center">
                                <FieldLabel className="text-label-m text-sarge-gray-700 w-[222px] font-medium uppercase">
                                    Email
                                </FieldLabel>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    className="h-11 flex-1"
                                />
                            </div>
                        </div>

                        {localError && (
                            <div className="text-sarge-error-700 flex items-center gap-2 text-sm">
                                <AlertCircle className="size-4" />
                                {localError}
                            </div>
                        )}
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <div className="flex flex-1 items-center justify-end gap-5">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="text-label-s text-sarge-primary-600 hover:text-sarge-primary-700 px-0 py-2 font-medium transition-colors"
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
