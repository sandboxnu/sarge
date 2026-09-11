import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full overflow-hidden">
            <div className="bg-sarge-gray-0 relative hidden overflow-hidden lg:flex lg:w-1/2">
                <div className="from-sarge-primary-100 to-sarge-gray-0 absolute -inset-y-10 left-0 w-full rounded-r-2xl bg-linear-to-b" />

                <div className="absolute top-0 left-0 z-10 pt-6 pr-6">
                    <Image src="/HelmetLogoFull.png" alt="Sarge" width={200} height={61} priority />
                </div>

                <div className="relative flex flex-1 items-center justify-center px-8 pt-24 pb-10 lg:px-12">
                    <div className="flex h-full max-w-md flex-col">
                        <p className="text-body-m text-sarge-gray-800 mb-10">
                            With Sarge you&apos;ll be able to manage tasks, assessments, and
                            candidates <span className="font-bold">all in one place.</span>
                        </p>
                        <div className="from-sarge-gray-0 via-sarge-gray-0 to-sarge-gray-0/0 w-full flex-1 rounded-md bg-linear-to-b shadow-[0_-4px_8px_0_rgba(0,0,0,0.03)]" />
                    </div>
                </div>
            </div>

            <div className="bg-sarge-gray-0 flex w-full items-center justify-center px-4 py-8 sm:px-8 lg:w-1/2 lg:px-16">
                <div className="w-full max-w-sm">{children}</div>
            </div>
        </div>
    );
}
