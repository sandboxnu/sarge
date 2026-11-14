import { BookOpen } from 'lucide-react';
import ReviewingContent from '@/lib/components/core/ReviewingContent';

export default function ReviewingPage() {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 p-5">
                <BookOpen className="size-5" />
                <h1 className="text-display-xs">Live Assessments</h1>
            </div>

            <ReviewingContent />
        </div>
    );
}
