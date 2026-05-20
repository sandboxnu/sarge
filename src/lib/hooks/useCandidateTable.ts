import type { PositionPreviewData } from './usePositionPreviewModal';

export type Candidate = PositionPreviewData['candidates'][number];

export function useCandidateTable(candidates: Candidate[]) {
    const rows = candidates.map((entry) => {
        const graders = entry.assessment?.reviewers ?? [];

        const hasSubmission =
            entry.assessmentStatus === 'SUBMITTED' || entry.assessmentStatus === 'GRADED';

        return {
            entry,
            graders,
            hasSubmission,
        };
    });

    return {
        rows,
        isEmpty: candidates.length === 0,
    };
}
