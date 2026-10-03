import { Button } from '@/lib/components/ui/Button';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import { toast } from 'sonner'
import { formatDeadline } from '@/lib/utils/date.utils';

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

   
    const handleCopyAdminEmail = async () => {
       try {
           await navigator.clipboard.writeText('p.fontenot@northeastern.edu');
           toast.success('Administrator’s email copied to clipboard');
       } catch {
           toast.error('Failed to copy email to clipboard');
       }
    }; 

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background mt-18 flex w-full max-w-2xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 py-3 text-xl font-bold">
                        {assessment.assessmentTemplate.title}
                    </h1>
                    <div>
                        // vectors blah blah
                        <p>
                        Assessment Expired {formatDeadline(assessment.deadline)}
                        </p>
                    </div>
                </div>

                  <p className="text-label-s text-sarge-gray-600 text-center">
                    <button
                        type="button"
                        onClick={handleCopyAdminEmail}
                        className="text-sarge-primary-500 underline"
                    >
                        Contact the assessment administrator
                    </button>{' '}
                    if you believe this is a mistake.
                </p>

                <div className="m-50"></div>
            </div>
        </div>
    );
}
