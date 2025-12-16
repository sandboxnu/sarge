import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/lib/components/Button';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
            <div className="flex flex-col items-center gap-6">
                <Image
                    src="/Winston Logomark.svg"
                    alt="Sarge Logo"
                    width={300}
                    height={300}
                    priority
                />

                <p className="text-display-xs text-sarge-gray-800 text-center">
                    This isn&apos;t a drill, Sarge. Log in.
                </p>

                <Button asChild variant="primary" className="px-8">
                    <Link href="/signin">Sign In</Link>
                </Button>
            </div>
        </div>
    );
}
