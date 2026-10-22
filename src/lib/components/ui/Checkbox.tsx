'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/lib/utils/cn.utils';

// Paths from the Figma "Action/checkbox" SVGs
const indicatorPaths = {
    check: 'M7.5 9.99967L9.16667 11.6663C9.16667 11.6663 11.1983 9.63476 12.5 8.33301',
    dash: 'M7 9.99967H13',
};

const Checkbox = React.forwardRef<
    React.ComponentRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
        indicator?: keyof typeof indicatorPaths;
    }
>(({ className, indicator = 'check', ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            'border-sarge-gray-200 bg-sarge-gray-0 peer ring-offset-background focus-visible:ring-sarge-primary-500 data-[state=checked]:bg-sarge-primary-500 data-[state=checked]:text-sarge-gray-50 data-[state=checked]:border-sarge-primary-500 size-4 shrink-0 rounded border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn('flex size-full items-center justify-center text-current')}
        >
            <svg viewBox="2.5 2.5 15 15" fill="none" className="size-full" aria-hidden="true">
                <path
                    d={indicatorPaths[indicator]}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
