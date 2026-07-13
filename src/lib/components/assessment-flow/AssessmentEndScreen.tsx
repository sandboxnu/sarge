import type { ReactNode } from 'react';
import { Button } from '@/lib/components/ui/Button';

type AssessmentEndScreenProps = {
    title: string;
    children: ReactNode;
};

export default function AssessmentEndScreen({ title, children }: AssessmentEndScreenProps) {
    const handleCloseTab = () => {
        // browsers commonly block script-initiated tab closes, so fall back to asking the candidate to close it manually
        window.close();
        alert('Your browser likely blocked the tab from closing. Please close this tab manually.');
    };

    return (
        <div className="bg-sarge-gray-50 flex h-full items-center justify-center p-8">
            <div className="border-sarge-gray-200 bg-background mt-18 flex w-full max-w-2xl flex-col gap-6 rounded-2xl border p-10 shadow-sm">
                <div>
                    <h1 className="text-sarge-gray-800 py-3 text-xl font-bold">{title}</h1>
                    <div>{children}</div>
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
