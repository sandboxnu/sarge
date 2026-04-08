import { Button } from '@/lib/components/ui/Button';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';

type AssessmentOutroProps = {
    assessment: CandidateAssessment;
};

export default function AssessmentOutro({ assessment }: AssessmentOutroProps) {
    const handleCloseTab = () => {
        window.close();
    };

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background flex w-full max-w-xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 py-3 text-xl font-bold">
                        {assessment.assessmentTemplate.title}
                    </h1>
                    <div>
                        <p className="mt-2 text-sm">
                            Your submission has been received. The {assessment.organizationName}{' '}
                            team will be in touch with next steps within the next few weeks.
                        </p>
                    </div>
                </div>

                <Button onClick={handleCloseTab} variant="primary">
                    Close Tab
                </Button>
                <p className="text-xs">
                    For any questions, please reach out to the exam administrator at .
                </p>
            </div>
        </div>
    );
}
