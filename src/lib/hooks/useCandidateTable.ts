import type { PositionPreviewData } from './usePositionPreviewModal';

export type Candidate = NonNullable<PositionPreviewData>['candidates'][number];

export function useCandidateTable(candidates: Candidate[]) {
    const rows = candidates.map((entry) => {
        const graders =
            entry.assessment?.reviews.map((r) => ({
                id: r.reviewer.id,
                name: r.reviewer.name,
                email: r.reviewer.email,
                image: r.reviewer.image,
            })) ?? [];

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
