'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn.utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

export interface AvatarData {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
}

interface AvatarGroupProps {
    avatars: AvatarData[];
    max?: number;
    size?: 'sm' | 'md';
    className?: string;
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function AvatarGroup({
    avatars,
    max = 2,
    size = 'sm',
    className,
}: AvatarGroupProps) {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;

    const sizeClasses = {
        sm: 'size-[25px] text-label-xs',
        md: 'size-[32px] text-label-xs',
    };

    if (avatars.length === 0) {
        return (
            <div
                className={cn(
                    'border-sarge-gray-300 rounded-full border border-dashed',
                    sizeClasses[size]
                )}
            />
        );
    }

    return (
        <div className={cn('flex -space-x-2', className)}>
            {visibleAvatars.map((avatar) => (
                <Tooltip key={avatar.id}>
                    <TooltipTrigger asChild>
                        <div
                            className={cn(
                                'bg-sarge-gray-200 text-sarge-gray-800 relative flex items-center justify-center rounded-full ring-2 ring-white',
                                sizeClasses[size]
                            )}
                        >
                            {avatar.image ? (
                                <Image
                                    src={avatar.image}
                                    alt={avatar.name}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <span className="font-medium">{getInitials(avatar.name)}</span>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={4}>
                        {avatar.name}
                    </TooltipContent>
                </Tooltip>
            ))}
            {remainingCount > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={cn(
                                'bg-sarge-gray-200 text-sarge-gray-800 flex items-center justify-center rounded-full ring-2 ring-white',
                                sizeClasses[size]
                            )}
                        >
                            <span className="font-medium">+{remainingCount}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={4}>
                        <div className="flex flex-col gap-0.5">
                            {avatars.slice(max).map((avatar) => (
                                <span key={avatar.id}>{avatar.name}</span>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
}
