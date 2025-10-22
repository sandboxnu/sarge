'use client';

import Link from 'next/link';
import { useAuth } from '../auth/auth-client';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-grey-50 sticky top-0 flex gap-10 px-3 py-2 text-xl">
            <nav>
                <Link href={'/dashboard'} className="text-s-purple font-nunito-sans font-extrabold">
                    Sarge
                </Link>

                {/** Placeholder for more info if user is signed in */}
                {user && <div className=""></div>}
            </nav>
        </header>
    );
}
