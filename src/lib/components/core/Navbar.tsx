'use client';

import Image from 'next/image';
import { useAuthSession } from '@/lib/auth/auth-context';

export function Navbar() {
    const { user } = useAuthSession();
    const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';

    return (
        <nav className="flex h-[var(--navbar-height)] w-full items-center justify-between bg-sarge-gray-50 py-2 pr-3">
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
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-[12.5px] bg-sarge-gray-200 px-2 py-[5px]">
                    <span className="text-[9.8px] leading-[14px] font-normal text-sarge-gray-800">
                        {userInitial}
                    </span>
                </div>
            </div>
        </nav>
    );
}
