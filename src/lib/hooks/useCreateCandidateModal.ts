import { useState } from 'react';
import { type CreateCandidateModalProps } from '@/lib/components/modal/CreateCandidateModal';
import { createCandidateSchema } from '@/lib/schemas/candidate.schema';

function useCreateCandidateModal({ onOpenChange, onCreate }: CreateCandidateModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [major, setMajor] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [resume, setResume] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [notes, setNotes] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState({
        fullName: false,
        email: false,
        major: false,
        resume: false,
        linkedin: false,
        github: false,
    });

    const clearFieldError = (field: keyof typeof fieldErrors) => {
        setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
    };

    const normalizeOptional = (value: string) => {
        const trimmed = value.trim();
        return trimmed ? trimmed : undefined;
    };

    const handleCreate = async () => {
        if (isCreating) return;

        const nextErrors = {
            fullName: !fullName.trim(),
            email: !email.trim(),
            major: !major.trim(),
            resume: false,
            linkedin: false,
            github: false,
        };

        if (nextErrors.fullName || nextErrors.email || nextErrors.major) {
            setFieldErrors(nextErrors);
            setLocalError('Please fill out all required fields.');
            return;
        }

        const candidatePayload = {
            name: fullName,
            email,
            major: normalizeOptional(major),
            graduationDate: normalizeOptional(graduationYear),
            resumeUrl: normalizeOptional(resume),
            linkedinUrl: normalizeOptional(linkedin),
            githubUrl: normalizeOptional(github),
        };

        const parsed = createCandidateSchema.safeParse(candidatePayload);
        if (!parsed.success) {
            const nextFieldErrorsFromSchema = {
                fullName: false,
                email: false,
                major: false,
                resume: false,
                linkedin: false,
                github: false,
            };

            for (const issue of parsed.error.issues) {
                const field = issue.path[0];
                if (field === 'name') nextFieldErrorsFromSchema.fullName = true;
                if (field === 'email') nextFieldErrorsFromSchema.email = true;
                if (field === 'major') nextFieldErrorsFromSchema.major = true;
                if (field === 'resumeUrl') nextFieldErrorsFromSchema.resume = true;
                if (field === 'linkedinUrl') nextFieldErrorsFromSchema.linkedin = true;
                if (field === 'githubUrl') nextFieldErrorsFromSchema.github = true;
            }

            setFieldErrors(nextFieldErrorsFromSchema);
            setLocalError(parsed.error.issues[0]?.message ?? 'Please check the form fields.');
            return;
        }

        setIsCreating(true);
        setLocalError(null);
        setFieldErrors({
            fullName: false,
            email: false,
            major: false,
            resume: false,
            linkedin: false,
            github: false,
        });
        try {
            await onCreate({
                name: parsed.data.name,
                email: parsed.data.email,
                ...(parsed.data.major && { major: parsed.data.major }),
                ...(parsed.data.graduationDate && { graduationDate: parsed.data.graduationDate }),
                ...(parsed.data.resumeUrl && { resumeUrl: parsed.data.resumeUrl }),
                ...(parsed.data.linkedinUrl && { linkedinUrl: parsed.data.linkedinUrl }),
                ...(parsed.data.githubUrl && { githubUrl: parsed.data.githubUrl }),
            });
            setFullName('');
            setEmail('');
            setMajor('');
            setGraduationYear('');
            setResume('');
            setLinkedin('');
            setGithub('');
            setNotes('');
            onOpenChange(false);
        } catch (err) {
            // if we reach here, it is a server/database error, we need to show a generic error message
            // TODO: handle errors in backend to provide more specific messages
            const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setLocalError(errorMsg);
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
        setNotes('');
        setLocalError(null);
        setFieldErrors({
            fullName: false,
            email: false,
            major: false,
            resume: false,
            linkedin: false,
            github: false,
        });
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
        notes,
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
        setGraduationYear: (value: string) => {
            setGraduationYear(value);
        },
        setResume: (value: string) => {
            setResume(value);
            clearFieldError('resume');
        },
        setLinkedin: (value: string) => {
            setLinkedin(value);
            clearFieldError('linkedin');
        },
        setGithub: (value: string) => {
            setGithub(value);
            clearFieldError('github');
        },
        setNotes,
        isCreating,
        localError,
        fieldErrors,
        handleCreate,
        handleCancel,
    };
}

export default useCreateCandidateModal;
