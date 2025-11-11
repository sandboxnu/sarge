'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-sarge-gray-50 sticky top-0 flex gap-10 px-3 py-2 text-xl">
            <nav>
                <Link
                    href={'/dashboard'}
                    className="text-sarge-primary-500 font-nunito-sans font-extrabold"
                >
                    Sarge
                </Link>

                {/** Placeholder for more info if user is signed in */}
                {user && <div className=""></div>}
            </nav>
        </header>
    );
}
