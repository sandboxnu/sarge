'use client';

import { ExternalLink } from 'lucide-react';

type LinkButtonProps = {
    href: string;
    label: string;
    className?: string;
};

export function LinkButton({ href, label, className }: LinkButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`border-sarge-gray-200 bg-sarge-gray-0 hover:bg-sarge-gray-50 inline-flex h-9 items-center gap-2 rounded-md border p-2 transition-colors ${
                className ?? ''
            }`}
        >
            <ExternalLink className="size-4" />
            <span className="text-label-xs text-sarge-gray-600 truncate leading-4 font-medium tracking-[0.406px]">
                {label}
            </span>
        </a>
    );
}
