import React from 'react';
import { cn } from '@/lib/utils/cn.utils';

export const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
    const hasError = props['aria-invalid'] === true;
    const borderColor = hasError
        ? 'border-sarge-error-700 hover:border-sarge-error-700 focus:border-sarge-error-700'
        : 'border-sarge-gray-200 hover:border-sarge-gray-300 focus:border-sarge-gray-300';

    return (
        <textarea
            className={cn(
                'bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 min-h-[120px] w-full rounded-lg border px-3 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                className,
                borderColor
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = 'Textarea';
