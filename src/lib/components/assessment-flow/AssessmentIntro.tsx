import { useState } from 'react';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import { formatDeadline, formatDuration } from '@/lib/utils/date.utils';
import { Button } from '@/lib/components/ui/Button';

type AssessmentIntroProps = {
    assessment: CandidateAssessment;
    totalTimeSeconds: number;
    onStart: () => void;
};

export default function AssessmentIntro({
    assessment,
    totalTimeSeconds,
    onStart,
}: AssessmentIntroProps) {
    const [guidelinesChecked, setGuidelinesChecked] = useState(false);

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background flex w-full max-w-2xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 py-3 text-xl font-bold">
                        {assessment.assessmentTemplate.title}
                    </h1>
                    <div>
                        <p className="text-md mt-2">Hey {assessment.candidateName},</p>
                        <p className="text-md mt-2">
                            Thank you for applying to {assessment.organizationName}! Please complete
                            the coding assessment below to continue your application.
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-md mb-1 font-bold">Assessment Details</p>
                    <ul className="text-md flex list-disc flex-col pl-5">
                        <li>Test type: Coding assessment</li>
                        <li>Duration: {formatDuration(totalTimeSeconds)}</li>
                        <li>Expires: {formatDeadline(assessment.deadline)}</li>
                    </ul>
                </div>

                <div>
                    <p className="text-md mb-1 font-bold">Before you begin:</p>
                    <ul className="text-md flex list-disc flex-col pl-5">
                        <li>You cannot go back and forth between questions</li>
                        <li>Do not refresh or close the page — your progress will auto-submit</li>
                        <li>Tab/window switching is monitored and reported</li>
                    </ul>
                </div>

                <div className="mt-12 flex flex-col items-center gap-5">
                    <label className="text-md mt-4 flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={guidelinesChecked}
                            onChange={(e) => setGuidelinesChecked(e.target.checked)}
                            className="mt-0.5"
                        />
                        <span>
                            I agree to complete this assessment independently, without the use of AI
                            tools, external resources, or assistance from others. I understand that
                            violations are monitored and reported.
                        </span>
                    </label>
                    <Button
                        className="px-4 py-2"
                        onClick={onStart}
                        variant="primary"
                        disabled={!guidelinesChecked}
                    >
                        Begin Assessment
                    </Button>
                    <p className="text-sm">You can also use this link to open your assessment.</p>
                </div>
            </div>
        </div>
    );
}
