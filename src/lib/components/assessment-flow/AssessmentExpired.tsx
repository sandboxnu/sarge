import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import AssessmentEndScreen from '@/lib/components/assessment-flow/AssessmentEndScreen';
import { formatDeadline } from '@/lib/utils/date.utils';

type AssessmentExpiredProps = {
    assessment: CandidateAssessment;
};

export default function AssessmentExpired({ assessment }: AssessmentExpiredProps) {
    return (
        <AssessmentEndScreen title={assessment.assessmentTemplate.title}>
            <p className="text-md mt-2">
                This assessment has expired. The due date,
                {assessment.deadline ? ` ${formatDeadline(assessment.deadline)},` : ''} has passed,
                so it can no longer be started or submitted.
            </p>
            <p className="text-md mt-2">
                If you believe this is a mistake, please reach out to the{' '}
                {assessment.organizationName} team.
            </p>
        </AssessmentEndScreen>
    );
}
