'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils/cn.utils';

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            aria-label="breadcrumb"
            data-slot="breadcrumb"
            className={cn('flex', props.className)}
            {...props}
        />
    );
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                'flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground [&_a]:transition-colors [&_a]:hover:text-foreground [&>li]:flex [&>li]:items-center',
                className
            )}
            {...props}
        />
    );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li data-slot="breadcrumb-item" className={cn('[&>a]:font-medium', className)} {...props} />
    );
}

function BreadcrumbLink({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'a'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'a';
    return (
        <Comp
            data-slot="breadcrumb-link"
            className={cn('hover:text-foreground', className)}
            {...props}
        />
    );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="breadcrumb-page"
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn('font-normal text-foreground', className)}
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    children,
    className,
    ...props
}: React.ComponentProps<'li'> & { children?: React.ReactNode }) {
    return (
        <li
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden="true"
            className={cn('[&>svg]:size-3.5', className)}
            {...props}
        >
            {children ?? <ChevronRight />}
        </li>
    );
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
};
