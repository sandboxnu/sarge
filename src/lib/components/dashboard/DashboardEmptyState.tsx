import Image from 'next/image';
import { cn } from '@/lib/utils/cn.utils';

/** Grey dog mark + message, centered in whatever space the panel gives it. */
export function DashboardEmptyState({
    message,
    className,
}: {
    message: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex w-full flex-1 flex-col items-center justify-center gap-5',
                className
            )}
        >
            <Image src="/GreyWinstonLogoMark.svg" alt="" width={76} height={40} />
            <p className="text-body-xs text-sarge-gray-600 text-center">{message}</p>
        </div>
    );
}
