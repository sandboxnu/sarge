'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn.utils';

// Field components based on shadcn/ui patterns
const Field = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { 'data-invalid'?: boolean }
>(({ className, 'data-invalid': invalid, ...props }, ref) => (
    <div
        ref={ref}
        data-invalid={invalid}
        className={cn('flex flex-col gap-0.5', className)}
        {...props}
    />
));
Field.displayName = 'Field';

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label ref={ref} className={cn('font-semibold', className)} {...props} />
    )
);
FieldLabel.displayName = 'FieldLabel';

const FieldError = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { errors?: Array<{ message?: string }> }
>(({ className, errors, ...props }, ref) => {
    if (!errors?.length) return null;
    return (
        <div ref={ref} className={cn('min-h-5', className)} {...props}>
            <p className="text-sarge-error-700 text-sm">{errors[0]?.message}</p>
        </div>
    );
});
FieldError.displayName = 'FieldError';

const FieldDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('text-sarge-gray-600 text-xs', className)} {...props} />
    )
);
FieldDescription.displayName = 'FieldDescription';

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('flex flex-col gap-y-4', className)} {...props} />
    )
);
FieldGroup.displayName = 'FieldGroup';

// Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        const hasError = props['aria-invalid'] === true;
        const borderColor = hasError
            ? 'border-sarge-error-700 hover:border-sarge-error-700 focus:border-sarge-error-700'
            : 'border-sarge-gray-200 hover:border-sarge-gray-600 focus:border-sarge-gray-600';

        return (
            <input
                type={type}
                className={cn(
                    'bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 rounded-lg border px-3 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
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

export { Field, FieldLabel, FieldError, FieldDescription, FieldGroup, Input };
