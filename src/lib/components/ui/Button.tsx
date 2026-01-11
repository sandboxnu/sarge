'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn.utils';

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none hover:cursor-pointer disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:h-[20px] [&_svg:not([class*='size-'])]:w-[20px]",
    {
        variants: {
            variant: {
                primary:
                    'bg-sarge-primary-500 text-sarge-gray-50 transition-colors duration-200 hover:bg-sarge-primary-600 disabled:opacity-50 [&_svg]:text-sarge-gray-50',
                secondary:
                    'border border-sarge-primary-500 bg-sarge-gray-50 text-sarge-primary-500 transition-colors duration-200 hover:bg-sarge-primary-100 disabled:opacity-50 [&_svg]:text-sarge-primary-500',
                tertiary:
                    'text-sarge-primary-500 transition-colors duration-200 hover:bg-sarge-primary-100 disabled:opacity-50 [&_svg]:text-sarge-primary-500',
            },
            size: {
                default: 'gap-[10px] rounded-lg px-1 py-2',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
