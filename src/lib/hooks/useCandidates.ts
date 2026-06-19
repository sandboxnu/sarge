import { useEffect, useState } from 'react';
import { type ApplicationDisplayInfo } from '@/lib/types/position.types';
import { type AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { toast } from 'sonner';
import {
    getCandidates,
    getPosition,
    createCandidate as createCandidateApi,
    batchCreateCandidates as batchCreateCandidatesApi,
} from '@/lib/api/positions';
import { sendAssessmentInvitation } from '@/lib/api/assessments';

export default function useCandidates(positionId: string) {
    const [candidates, setCandidates] = useState<ApplicationDisplayInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [positionTitle, setPositionTitle] = useState<string | null>(null);
    const [isSendingAssessments, setIsSendingAssessments] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    const switchToCSVModal = () => {
        setIsManualModalOpen(false);
        setIsCSVModalOpen(true);
    };

    useEffect(() => {
        if (!positionId) return;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const [candidatesData, positionData] = await Promise.all([
                    getCandidates(positionId),
                    getPosition(positionId),
                ]);

                setCandidates(candidatesData);
                setPositionTitle(positionData.title);
            } catch (err) {
                const message = (err as Error).message;
                setError(message);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [positionId]);

    const createCandidate = async (candidate: AddApplicationWithCandidateDataDTO) => {
        try {
            setLoading(true);
            setError(null);

            const created = await createCandidateApi(positionId, candidate);

            setCandidates((prev) => [...prev, created]);
            toast.success('Candidate created successfully');
        } catch (err) {
            // We throw here so so we catch the error properly in useCreateCandidateModal handleCreate
            // and display the error on the modal instead of resolving the onCreate promise and closing the modal.
            // If we were to setError here, the error would be visible on the position page instead.
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const batchCreateCandidates = async (candidates: AddApplicationWithCandidateDataDTO[]) => {
        try {
            setLoading(true);
            setError(null);

            const created = await batchCreateCandidatesApi(positionId, candidates);

            setCandidates((prev) => [...prev, ...created.candidates]);
            toast.success('Candidates created successfully');
        } catch (err) {
            const message = (err as Error).message;
            // TODO (design question): do we want to toast here?
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendAssessments = async (deadlineIso: string) => {
        try {
            setIsSendingAssessments(true);
            const result = await sendAssessmentInvitation(positionId, deadlineIso);

            if (result.totalSent > 0) {
                toast.success(
                    `${result.totalSent} assessment invitation${result.totalSent !== 1 ? 's' : ''} sent successfully`
                );
            }

            if (result.totalFailed > 0) {
                toast.error(
                    `${result.totalFailed} invitation${result.totalFailed !== 1 ? 's' : ''} failed to send`
                );
            }

            if (result.totalSent === 0 && result.totalFailed === 0) {
                toast.info('No candidates with pending assessments to send');
            }
        } catch (err) {
            const errorMessage = (err as Error).message;
            if (errorMessage.includes('does not have an assessment template assigned')) {
                toast.error('This position does not have an assessment template assigned');
            } else {
                toast.error(errorMessage || 'Assessment invitations failed to send');
            }
        } finally {
            setIsSendingAssessments(false);
            setIsSendModalOpen(false);
        }
    };

    return {
        candidates,
        loading,
        error,
        positionTitle,
        createCandidate,
        batchCreateCandidates,
        isSendingAssessments,
        handleSendAssessments,
        isManualModalOpen,
        setIsManualModalOpen,
        isCSVModalOpen,
        setIsCSVModalOpen,
        isSendModalOpen,
        setIsSendModalOpen,
        switchToCSVModal,
    };
}
