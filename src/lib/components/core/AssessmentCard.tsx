import { cn } from '@/lib/utils/cn.utils';
import type { AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';

interface AssessmentCardProps {
    template: AssessmentTemplateListItemDTO;
    isSelected: boolean;
    onClick: () => void;
}

export default function AssessmentCard({ template, isSelected, onClick }: AssessmentCardProps) {
    return (
        <div
            className={cn(
                'flex cursor-pointer gap-4.5 rounded-xl border-1 p-4',
                isSelected
                    ? 'border-sarge-primary-500 bg-sarge-primary-50 ring-sarge-primary-200 ring-2 ring-inset'
                    : 'border-sarge-gray-200 hover:bg-sarge-primary-100 hover:border-sarge-primary-400'
            )}
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="text-foreground truncate text-sm font-medium">{template.title}</div>
                <div className="text-sarge-gray-500 font-sans text-xs leading-4 font-medium tracking-[0.406px]">
                    Assigned to{' '}
                    <span className="text-sarge-primary-500 underline">
                        {template.positions.length} positions
                    </span>
                </div>
            </div>
        </div>
    );
}
