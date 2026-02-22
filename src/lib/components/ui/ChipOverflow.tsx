'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Chip } from '@/lib/components/ui/Chip';
import type { TagDTO } from '@/lib/schemas/tag.schema';

interface ChipOverflowProps {
    chips: TagDTO[];
}

export default function ChipOverflow({ chips }: ChipOverflowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + 10,
        });
    }, []);

    // we delay the close so the mouse can cross the btwn the pill and portal popover without flickering
    const scheduleClose = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 80);
    }, []);

    const cancelClose = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    const handleTriggerEnter = () => {
        cancelClose();
        updatePosition();
        setIsOpen(true);
    };

    const handleTriggerLeave = () => {
        scheduleClose();
    };

    const handlePopoverEnter = () => {
        cancelClose();
    };

    const handlePopoverLeave = () => {
        scheduleClose();
    };

    // we need to cleanup the timeout (line 27)
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    // if we scroll anywhere, we need to close the popover
    useEffect(() => {
        if (!isOpen) return;

        const handleScroll = () => {
            cancelClose();
            setIsOpen(false);
        };
        window.addEventListener('scroll', handleScroll, true);
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, [isOpen, cancelClose]);

    if (chips.length === 0) return null;

    return (
        <span
            ref={triggerRef}
            className="relative inline-flex items-center"
            onMouseEnter={handleTriggerEnter}
            onMouseLeave={handleTriggerLeave}
        >
            <span
                className="text-label-xs bg-sarge-gray-100 text-sarge-gray-500 hover:bg-sarge-gray-200 hover:text-sarge-gray-700 inline-flex cursor-default items-center rounded-md px-2 py-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                +{chips.length}
            </span>

            {/* so we create a portal for the popover so that overflow hidden or scroll ancestors 
            don't affect it (cut it off - the sidebar card list is an example) */}
            {isOpen &&
                position &&
                createPortal(
                    <span
                        className="fixed z-[100]"
                        style={{
                            top: position.top,
                            left: position.left,
                            transform: 'translateY(-50%)',
                        }}
                        onMouseEnter={handlePopoverEnter}
                        onMouseLeave={handlePopoverLeave}
                    >
                        <span className="border-sarge-gray-200 bg-background absolute top-1/2 left-[-5px] z-10 size-2.5 -translate-y-1/2 rotate-45 border-b border-l shadow-sm" />

                        <span className="border-sarge-gray-200 bg-background relative z-20 flex flex-col gap-1.5 rounded-lg border px-3 py-2.5 shadow-md">
                            {chips.map((chip, idx) => (
                                <Chip
                                    key={chip.id ?? idx}
                                    className="chip-overflow-enter rounded-md px-2 py-1 text-xs"
                                    style={{
                                        backgroundColor: chip.colorHexCode,
                                        animationDelay: `${idx * 50}ms`,
                                    }}
                                >
                                    {chip.name}
                                </Chip>
                            ))}
                        </span>
                    </span>,
                    document.body
                )}
        </span>
    );
}
