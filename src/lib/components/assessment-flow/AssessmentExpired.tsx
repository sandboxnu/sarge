import { Button } from '@/lib/components/ui/Button';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import { formatDeadline } from '@/lib/utils/date.utils';

type AssessmentExpiredProps = {
    assessment: CandidateAssessment;
};

export default function AssessmentExpired({ assessment }: AssessmentExpiredProps) {
    const handleCloseTab = () => {
        // same behvaior as closing the tab in the assessmentoutro
        window.close();
        alert('Your browser likely blocked the tab from closing. Please close this tab manually.');
    };

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background mt-18 flex w-full max-w-2xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 py-3 text-xl font-bold">
                        {assessment.assessmentTemplate.title}
                    </h1>
                    <div>
                        <p className="text-md mt-2">
                            This assessment has expired. The due date,
                            {assessment.deadline
                                ? ` ${formatDeadline(assessment.deadline)},`
                                : ''}{' '}
                            has passed, so it can no longer be started or submitted.
                        </p>
                        <p className="text-md mt-2">
                            If you believe this is a mistake, please reach out to the{' '}
                            {assessment.organizationName} team.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <Button className="w-10 px-12 py-2" onClick={handleCloseTab} variant="primary">
                        Close Tab
                    </Button>
                </div>
                <p className="text-sm">
                    For any questions, please reach out to the exam administrator at [email].
                </p>
                <div className="m-50"></div>
            </div>
        </div>
    );
}
