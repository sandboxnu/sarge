'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn.utils';

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center text-sm font-medium whitespace-nowrap transition-all outline-none hover:cursor-pointer disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:h-[20px] [&_svg:not([class*='size-'])]:w-[20px]",
    {
        variants: {
            variant: {
                primary:
                    'bg-sarge-primary-500 hover:bg-sarge-primary-600 text-sarge-gray-50 [&_svg]:text-sarge-gray-50 transition-colors duration-200 disabled:opacity-50',
                secondary:
                    'bg-sarge-gray-50 border-sarge-primary-500 hover:bg-sarge-primary-100 text-sarge-primary-500 [&_svg]:text-sarge-primary-500 border transition-colors duration-200 disabled:opacity-50',
                tertiary:
                    'hover:bg-sarge-primary-100 [&_svg]:text-sarge-primary-500 text-sarge-primary-500 transition-colors duration-200 disabled:opacity-50',
                icon: 'bg-sarge-gray-100 hover:bg-sarge-gray-200 text-sarge-gray-600 [&_svg]:text-sarge-gray-600 hover:text-sarge-gray-700 hover:[&_svg]:text-sarge-gray-700 border-none transition-colors duration-200 disabled:opacity-50',
                link: 'text-sarge-primary-500 [&_svg]:text-sarge-primary-500 underline-offset-4 hover:underline disabled:opacity-50',
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
