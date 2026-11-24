import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

/**
 * "+ New …" link in a panel header. Not wired to anything yet; pass `onClick` once the
 * create flows are hooked up.
 */
export function PanelAction({
    label,
    onClick,
    className,
}: {
    label: string;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'text-label-xs text-sarge-primary-600 flex shrink-0 cursor-pointer items-center gap-1',
                className
            )}
        >
            {/* strokeWidth 3 on lucide's 24px grid = Figma's 1.5px stroke at 12px */}
            <Plus className="size-3" strokeWidth={3} />
            {label}
        </button>
    );
}
