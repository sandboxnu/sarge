import Image from 'next/image';
import { toast } from 'sonner';
import type { CandidateAssessment } from '@/lib/types/candidate-assessment.types';
import { formatDeadline } from '@/lib/utils/date.utils';

type AssessmentExpirationProps = {
    assessment: CandidateAssessment;
};

export default function AssessmentExpiration({ assessment }: AssessmentExpirationProps) {
    const handleCopyAdminEmail = async () => {
        try {
            // TODO: replace with the assessment's actual administrator once available
            await navigator.clipboard.writeText('p.fontenot@northeastern.edu');
            toast.success('Administrator’s email copied to clipboard', { duration: 3000 });
        } catch {
            toast.error('Failed to copy email to clipboard');
        }
    };

    return (
        <div className="bg-sarge-gray-50 flex min-h-full flex-col items-center px-8 pt-17">
            <div className="border-sarge-gray-200 bg-background flex w-full max-w-[692px] flex-1 flex-col items-center rounded-t-3xl border border-b-0 px-[50px] pt-14 pb-10">
                <h1 className="text-label-l self-start font-bold">
                    {assessment.assessmentTemplate.title}
                </h1>

                <Image
                    src="/GreyWinstonLogoMark.svg"
                    alt=""
                    width={272}
                    height={144}
                    className="mt-22.5"
                    priority
                />
                <div className="mt-4 text-center">
                    <p className="text-label-l text-sarge-gray-600">Assessment Expired</p>
                    <p className="text-label-m text-sarge-gray-600">
                        {formatDeadline(assessment.deadline)}
                    </p>
                </div>

                <p className="text-label-s text-sarge-gray-600 mt-6 text-center">
                    <button
                        type="button"
                        onClick={handleCopyAdminEmail}
                        className="text-sarge-primary-500 cursor-pointer underline"
                    >
                        Contact the assessment administrator
                    </button>{' '}
                    if you believe this is a mistake.
                </p>
            </div>
        </div>
    );
}
