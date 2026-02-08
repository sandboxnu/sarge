import { cn } from '@/lib/utils/cn.utils';

export type ChipVariant = 'neutral' | 'success' | 'error' | 'warning' | 'primary' | 'outline';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: ChipVariant;
    className?: string;
}

export function Chip({ children, variant = 'neutral', className, ...props }: ChipProps) {
    const base = 'inline-flex items-center px-2 py-1 rounded-lg text-label-xs';
    const variantStyles: Record<ChipVariant, string> = {
        neutral: 'bg-sarge-gray-200 text-sarge-gray-600',
        success: 'bg-sarge-success-100 text-sarge-success-800',
        error: 'bg-sarge-error-200 text-sarge-error-700',
        warning: 'bg-sarge-warning-100 text-sarge-warning-500',
        primary: 'bg-sarge-primary-200 text-sarge-primary-600',
        outline:
            'rounded-md border border-sarge-gray-500 bg-sarge-gray-50 text-label-s !text-sarge-gray-600',
    };

    return (
        <span className={cn(base, variantStyles[variant], className)} {...props}>
            {children}
        </span>
    );
}
