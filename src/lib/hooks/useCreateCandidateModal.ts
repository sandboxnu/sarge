import { useState } from 'react';
import { toast } from 'sonner';
import { type CreateCandidateModalProps } from '@/lib/components/modal/CreateCandidateModal';

function useCreateCandidateModal({ onOpenChange, onCreate }: CreateCandidateModalProps) {
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
        if (isCreating) return;

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
            setFullName('');
            setEmail('');
            setMajor('');
            setGraduationYear('');
            setResume('');
            setLinkedin('');
            setGithub('');
            onOpenChange(false);
            toast.success('Candidate added successfully.');
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

    return {
        fullName,
        email,
        major,
        graduationYear,
        resume,
        linkedin,
        github,
        setFullName,
        setEmail,
        setMajor,
        setGraduationYear,
        setResume,
        setLinkedin,
        setGithub,
        isCreating,
        localError,
        handleCreate,
        handleCancel,
    };
}

export default useCreateCandidateModal;
