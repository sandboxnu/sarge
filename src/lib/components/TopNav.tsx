'use client';

import Image from 'next/image';
import { useAuthSession } from '@/lib/auth/auth-context';

export function TopNav() {
    const { user } = useAuthSession();
    const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';

    return (
        <nav className="bg-sarge-gray-50 flex h-[var(--navbar-height)] w-full items-center justify-between py-2 pr-3">
            <div className="flex h-[24px] w-[80px] shrink-0 items-center">
                <Image
                    src="/HelmetLogoFull.png"
                    alt="Sarge"
                    width={80}
                    height={24}
                    className="h-full w-full object-contain"
                    priority
                />
            </div>
            <div className="flex shrink-0 items-center">
                <div className="bg-sarge-gray-200 flex h-[25px] w-[25px] items-center justify-center rounded-[12.5px] px-2 py-[5px]">
                    <span className="text-sarge-gray-800 text-[9.8px] leading-[14px] font-normal">
                        {userInitial}
                    </span>
                </div>
            </div>
        </nav>
    );
}
