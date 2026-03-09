'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils/cn.utils';

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:cursor-pointer disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:h-[20px] [&_svg:not([class*='size-'])]:w-[20px]",
    {
        variants: {
            variant: {
                primary:
                    'bg-sarge-primary-500 hover:bg-sarge-primary-600 text-sarge-gray-50 [&_svg]:text-sarge-gray-50 gap-[10px] px-1 py-2 transition-colors duration-200 disabled:opacity-50',
                secondary:
                    'bg-sarge-gray-50 border-sarge-primary-500 hover:bg-sarge-primary-100 text-sarge-primary-500 [&_svg]:text-sarge-primary-500 gap-[10px] border px-1 py-2 transition-colors duration-200 disabled:opacity-50',
                tertiary:
                    'hover:bg-sarge-primary-100 [&_svg]:text-sarge-primary-500 text-sarge-primary-500 gap-[10px] px-1 py-2 transition-colors duration-200 disabled:opacity-50',
                icon: 'bg-sarge-gray-0 hover:bg-sarge-gray-100 text-sarge-gray-600 [&_svg]:text-sarge-gray-600 hover:text-sarge-gray-800 hover:[&_svg]:text-sarge-gray-800 border-none p-2 transition-colors duration-200 disabled:opacity-50',
                dropdown:
                    'bg-sarge-gray-0 border-sarge-gray-200 hover:bg-sarge-gray-100 text-foreground [&_svg]:text-sarge-gray-600 hover:[&_svg]:text-sarge-gray-800 h-11 gap-2 border py-2 pr-4 pl-3 transition-colors duration-200 disabled:opacity-50',
                link: 'text-sarge-primary-500 [&_svg]:text-sarge-primary-500 gap-[10px] px-1 py-2 underline-offset-4 hover:underline disabled:opacity-50',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    }
);

function Button({
    className,
    variant,
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
            className={cn(buttonVariants({ variant, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
