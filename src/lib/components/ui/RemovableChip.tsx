import { X } from 'lucide-react';
import { Chip, type ChipVariant } from '@/lib/components/ui/Chip';
import { cn } from '@/lib/utils/cn.utils';

interface RemovableChipProps {
    label: string;
    onRemove: () => void;
    variant?: ChipVariant;
    className?: string;
    truncate?: boolean;
}

export function RemovableChip({
    label,
    onRemove,
    variant = 'neutral',
    className,
    truncate = false,
}: RemovableChipProps) {
    return (
        <Chip
            variant={variant}
            className={cn('text-body-xs gap-1', className)}
            onClick={(e) => e.stopPropagation()}
        >
            {truncate ? <span className="truncate">{label}</span> : label}
            <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemove();
                    }
                }}
                className="text-sarge-gray-600 hover:text-sarge-gray-800"
            >
                <X className="size-[15px]" />
            </span>
        </Chip>
    );
}
