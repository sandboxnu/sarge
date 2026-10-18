'use client';

import type { ReactNode } from 'react';

export interface InstructionsContentProps {
    children: ReactNode;
}

export default function InstructionsContent({ children }: InstructionsContentProps) {
    return (
        <div className="border-sarge-gray-200 text-body-xs text-sarge-gray-800 flex max-h-[270px] flex-col gap-3 overflow-y-auto rounded-lg border p-5">
            {children}
        </div>
    );
}
