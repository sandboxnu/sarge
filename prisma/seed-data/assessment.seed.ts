import type { AssessmentStatus } from '@/generated/prisma';
import { getDateToEOD } from '@/lib/utils/date.utils';

export const assessmentsData: Array<{
    id: string;
    candidateId: string;
    assessmentTemplateId: string;
    assignedAt: Date;
    submittedAt: Date | null;
    deadline: Date;
    reviewerIds: string[];
    applicationStatus: AssessmentStatus;
}> = [
    {
        id: 'assessment_carter_001',
        candidateId: 'cand_carter_herman_001',
        assessmentTemplateId: 'assessment_template_general_001',
        assignedAt: new Date('2026-04-06T14:00:00Z'),
        submittedAt: new Date('2026-04-12T17:30:00Z'),
        deadline: new Date(getDateToEOD('2026-04-12')),
        reviewerIds: ['user_laith_taher_001', 'user_brad_derby_001'],
        applicationStatus: 'GRADED',
    },
    {
        id: 'assessment_laith_001',
        candidateId: 'cand_laith_taher_001',
        assessmentTemplateId: 'assessment_template_general_001',
        assignedAt: new Date('2026-04-06T14:00:00Z'),
        submittedAt: null,
        deadline: new Date(getDateToEOD('2026-04-12')),
        reviewerIds: [],
        applicationStatus: 'NOT_STARTED',
    },
    {
        id: 'assessment_anzhuo_001',
        candidateId: 'cand_anzhuo_wang_001',
        assessmentTemplateId: 'assessment_template_general_001',
        assignedAt: new Date('2026-04-06T14:00:00Z'),
        submittedAt: null,
        deadline: new Date(getDateToEOD('2026-04-12')),
        reviewerIds: [],
        applicationStatus: 'EXPIRED',
    },
];
