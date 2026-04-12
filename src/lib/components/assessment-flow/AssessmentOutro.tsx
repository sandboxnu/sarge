import { Button } from '@/lib/components/ui/Button';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';

type AssessmentOutroProps = {
    assessment: CandidateAssessment;
};

export default function AssessmentOutro({ assessment }: AssessmentOutroProps) {
    const handleCloseTab = () => {
        window.close();
        // browser likely blocks it -> see javascript
        // apparently hackerrank has a "you can safely close this tab" message so i put that too
        alert('Your browser likely blocked the tab from closing. Please close this tab manually.');
    };

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background flex w-full max-w-2xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 py-3 text-xl font-bold">
                        {assessment.assessmentTemplate.title}
                    </h1>
                    <div>
                        <p className="text-md mt-2">
                            Your submission has been received. The {assessment.organizationName}{' '}
                            team will be in touch with next steps within the next few weeks.
                        </p>
                        <p className="text-md mt-2">You can safely close this tab.</p>
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