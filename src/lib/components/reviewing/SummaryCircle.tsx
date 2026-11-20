import Image from 'next/image';
import { cn } from '@/lib/utils/cn.utils';

/**
 * Performance preview shown in the corner of a live assessment card.
 *
 * TODO: render the colored segments once scoring is converted to non-numeric. Until then this
 * is always the grey "not started" outline from the design.
 */
export default function SummaryCircle({ className }: { className?: string }) {
    return (
        <Image
            src="/SummaryCirclePlaceholder.svg"
            alt=""
            aria-hidden
            width={45}
            height={45}
            className={cn('size-[45px] shrink-0', className)}
        />
    );
}
