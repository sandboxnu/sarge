import Image from 'next/image';
import Link from 'next/link';
import type { OutroReason } from '@/lib/types/candidate-assessment.types';

type AssessmentOutroProps = {
    reason: OutroReason;
    candidateName: string;
};

export default function AssessmentOutro({ reason, candidateName }: AssessmentOutroProps) {
    const isExpired = reason === 'expired';
    const isAlreadyStarted = reason === 'already_started';

    const heading = isAlreadyStarted
        ? 'Assessment already in progress'
        : isExpired
          ? 'Your time is up'
          : 'Assessment submitted!';

    const description = isAlreadyStarted
        ? 'This assessment was already started. Your work has been submitted.'
        : isExpired
          ? "Don't worry, we submitted your work."
          : `Thank you for completing your assessment${candidateName ? `, ${candidateName}` : ''}.`;

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border p-10 text-center shadow-sm">
                <Image
                    src="/GreyWinstonLogoMark.svg"
                    width={80}
                    height={80}
                    alt="Winston"
                    className="opacity-60"
                />

                <div>
                    <h1 className="text-display-s">{heading}</h1>
                    <p className="text-body-s text-sarge-gray-500 mt-2">{description}</p>
                </div>

                <Link
                    href="/"
                    className="bg-sarge-primary-500 hover:bg-sarge-primary-600 text-primary-foreground flex h-11 items-center justify-center rounded-lg px-8 text-sm font-medium transition-colors"
                >
                    Continue
                </Link>
            </div>
        </div>
    );
}
