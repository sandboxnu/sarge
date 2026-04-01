import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import { formatDeadline, formatDuration } from '@/lib/utils/date.utils';

type AssessmentIntroProps = {
    assessment: CandidateAssessment;
    totalTimeSeconds: number;
    onStart: () => void;
};

const GUIDELINES = [
    'Questions are linear - you cannot go back to previous questions.',
    'Changing or leaving this tab will be reported.',
    'Refreshing the page will end your assessment.',
    'Your work is automatically submitted when time runs out.',
];

export default function AssessmentIntro({
    assessment,
    totalTimeSeconds,
    onStart,
}: AssessmentIntroProps) {
    const questionCount = assessment.assessmentTemplate.tasks.length;

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background flex w-full max-w-xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 text-2xl font-semibold">
                        {assessment.assessmentTemplate.title}
                    </h1>
                    <div className="text-sarge-gray-500 mt-3 flex gap-6 text-sm">
                        <span>
                            <span className="text-sarge-gray-700 font-medium">{questionCount}</span>{' '}
                            question{questionCount !== 1 ? 's' : ''}
                        </span>
                        <span>
                            <span className="text-sarge-gray-700 font-medium">
                                {formatDuration(totalTimeSeconds)}
                            </span>{' '}
                            total time
                        </span>
                        <span>
                            Due{' '}
                            <span className="text-sarge-gray-700 font-medium">
                                {formatDeadline(assessment.deadline)}
                            </span>
                        </span>
                    </div>
                </div>

                <div>
                    <p className="text-sarge-gray-700 mb-3 text-sm font-medium">Before you start</p>
                    <ul className="flex flex-col gap-2">
                        {GUIDELINES.map((g) => (
                            <li
                                key={g}
                                className="text-sarge-gray-600 flex items-start gap-2 text-sm"
                            >
                                <span className="bg-sarge-gray-300 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                                {g}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="button"
                    onClick={onStart}
                    className="bg-sarge-primary-500 hover:bg-sarge-primary-600 text-primary-foreground h-11 w-full rounded-lg text-sm font-medium transition-colors"
                >
                    Start Assessment
                </button>
            </div>
        </div>
    );
}
