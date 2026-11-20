import Image from 'next/image';
import { cn } from '@/lib/utils/cn.utils';

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
