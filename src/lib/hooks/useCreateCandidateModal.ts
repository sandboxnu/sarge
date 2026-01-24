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
    const [fieldErrors, setFieldErrors] = useState({
        fullName: false,
        email: false,
        major: false,
    });

    const clearFieldError = (field: keyof typeof fieldErrors) => {
        setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
    };

    const handleCreate = async () => {
        if (isCreating) return;

        const nextErrors = {
            fullName: !fullName.trim(),
            email: !email.trim(),
            major: !major.trim(),
        };

        if (nextErrors.fullName || nextErrors.email || nextErrors.major) {
            setFieldErrors(nextErrors);
            setLocalError('Please fill out all required fields.');
            return;
        }

        setIsCreating(true);
        setLocalError(null);
        setFieldErrors({ fullName: false, email: false, major: false });
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
        setFieldErrors({ fullName: false, email: false, major: false });
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
        setFullName: (value: string) => {
            setFullName(value);
            clearFieldError('fullName');
        },
        setEmail: (value: string) => {
            setEmail(value);
            clearFieldError('email');
        },
        setMajor: (value: string) => {
            setMajor(value);
            clearFieldError('major');
        },
        setGraduationYear,
        setResume,
        setLinkedin,
        setGithub,
        isCreating,
        localError,
        fieldErrors,
        handleCreate,
        handleCancel,
    };
}

export default useCreateCandidateModal;
