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
                    'bg-sarge-primary-500 text-sarge-gray-50 transition-colors duration-200 hover:bg-sarge-primary-600 disabled:opacity-50 [&_svg]:text-sarge-gray-50',
                secondary:
                    'border border-sarge-primary-500 bg-sarge-gray-50 text-sarge-primary-500 transition-colors duration-200 hover:bg-sarge-primary-100 disabled:opacity-50 [&_svg]:text-sarge-primary-500',
                tertiary:
                    'text-sarge-primary-500 transition-colors duration-200 hover:bg-sarge-primary-100 disabled:opacity-50 [&_svg]:text-sarge-primary-500',
                success:
                    'bg-sarge-success-500 text-white transition-colors duration-200 hover:bg-sarge-success-800 disabled:opacity-50 [&_svg]:text-white',
                'success-outline':
                    'border border-sarge-success-500 bg-transparent text-sarge-success-500 transition-colors duration-200 hover:bg-sarge-success-100 disabled:opacity-50 [&_svg]:text-sarge-success-500',
                destructive:
                    'bg-destructive text-destructive-foreground transition-colors duration-200 hover:bg-destructive/90 disabled:opacity-50 [&_svg]:text-destructive-foreground',
                'destructive-outline':
                    'border border-border bg-transparent text-muted-foreground transition-colors duration-200 hover:bg-muted disabled:opacity-50',
                link: 'text-sarge-primary-500 underline-offset-4 hover:underline disabled:opacity-50 [&_svg]:text-sarge-primary-500',
            },
            size: {
                default:
                    'gap-[10px] rounded-lg px-4 py-2 text-sm leading-5 font-medium tracking-design',
                sm: 'gap-2 rounded-md px-3 py-1.5 text-sm leading-5 font-medium tracking-design',
                md: 'gap-2 rounded-lg px-6 py-2.5 text-sm leading-5 font-medium tracking-design',
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
