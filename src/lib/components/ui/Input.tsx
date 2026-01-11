import React from 'react';
import { cn } from '@/lib/utils/cn.utils';

export const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
    const hasError = props['aria-invalid'] === true;
    const borderColor = hasError
        ? 'border-sarge-error-700 hover:border-sarge-error-700 focus:border-sarge-error-700'
        : 'border-sarge-gray-200 hover:border-sarge-gray-600 focus:border-sarge-gray-600';

    return (
        <input
            type={type}
            className={cn(
                'rounded-lg border bg-sarge-gray-50 px-3 py-1 text-sarge-gray-800 transition-colors placeholder:text-sarge-gray-500 disabled:cursor-not-allowed disabled:opacity-50',
                borderColor,
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';
