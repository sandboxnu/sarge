import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="bg-sarge-gray-50 flex h-full w-full flex-col">
            <header className="border-sarge-gray-200 flex h-[45px] items-center justify-between border-b bg-white px-4">
                <Link href="/">
                    <Image src="/Sarge_logo.svg" alt="Sarge Logo" width={80} height={24} priority />
                </Link>
            </header>
            <main className="flex flex-1 justify-center px-[107px] pt-[53px] pb-[24px]">
                <div className="border-sarge-gray-200 relative flex h-[658px] w-full max-w-[1070px] flex-col items-center rounded-[25px] border bg-white">
                    <h1 className="tracking-design mt-[159px] text-2xl leading-7 font-bold text-black">
                        Oops! Something went wrong!
                    </h1>
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <Image src="/404-dog.svg" alt="" width={191} height={101} />
                        <p className="tracking-design text-xl leading-7 font-medium whitespace-nowrap text-[#707070]">
                            404 Page not found
                        </p>
                    </div>
                    <p className="tracking-design mt-[76px] text-base leading-5 font-medium whitespace-nowrap text-[#707070]">
                        We couldn’t find the page you were looking for.
                    </p>
                </div>
            </main>
        </div>
    );
}
