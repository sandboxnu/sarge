import Image from 'next/image';

type AssessmentNavbarProps = {
    candidateName: string;
};

export default function AssessmentNavbar({ candidateName }: AssessmentNavbarProps) {
    return (
        <header className="border-sarge-gray-200 bg-background flex h-[var(--navbar-height)] items-center justify-between border-b px-4">
            <Image
                src="/Sarge_logo.svg"
                alt="Sarge Logo"
                width={85}
                height={35}
                className="shrink-0 object-contain object-left"
                priority
            />
            <div className="text-sarge-gray-700 flex items-center gap-2 text-sm">
                <span>{candidateName}</span>
                <span className="text-sarge-primary-500 cursor-pointer hover:underline">
                    Not you?
                </span>
            </div>
        </header>
    );
}
