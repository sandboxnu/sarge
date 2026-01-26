import React from 'react';
import { cn } from '@/lib/utils/cn.utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, ...props }, ref) => {
        const hasError = error === true;
        const borderColor = hasError
            ? 'border-sarge-error-700 hover:border-sarge-error-700 focus:border-sarge-error-700'
            : 'border-sarge-gray-200 hover:border-sarge-gray-300 focus:border-sarge-gray-300';

        return (
            <input
                type={type}
                className={cn(
                    'h-11 rounded-lg border bg-sarge-gray-50 px-3 py-2 text-sarge-gray-800 transition-colors placeholder:text-sarge-gray-500 disabled:cursor-not-allowed disabled:opacity-50',
                    borderColor,
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = 'Input';
