import React from 'react';
import { cn } from '@/lib/utils/cn.utils';

export const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
    const hasError = props['aria-invalid'] === true;
    const borderColor = hasError
        ? 'border-sarge-error-700 hover:border-sarge-error-700 focus:border-sarge-error-700'
        : 'border-sarge-gray-200 hover:border-sarge-gray-300 focus:border-sarge-gray-300';

    return (
        <input
            type={type}
            className={cn(
                'bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg border px-3 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                className,
                borderColor
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';
