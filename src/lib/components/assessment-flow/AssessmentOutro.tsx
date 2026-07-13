import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import AssessmentEndScreen from '@/lib/components/assessment-flow/AssessmentEndScreen';

type AssessmentOutroProps = {
    assessment: CandidateAssessment;
};

export default function AssessmentOutro({ assessment }: AssessmentOutroProps) {
    return (
        <AssessmentEndScreen title={assessment.assessmentTemplate.title}>
            <p className="text-md mt-2">
                Your submission has been received. The {assessment.organizationName} team will be in
                touch with next steps within the next few weeks.
            </p>
            <p className="text-md mt-2">You can safely close this tab.</p>
        </AssessmentEndScreen>
    );
}
