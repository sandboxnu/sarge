import { SearchIcon } from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';
import { type InputHTMLAttributes } from 'react';

type SearchProps = InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

export function Search({ className, ...inputProps }: SearchProps) {
    return (
        <div className="relative h-full w-full">
            <SearchIcon className="text-sarge-gray-500 absolute top-1/2 left-3 size-5 -translate-y-1/2" />
            <Input
                type="text"
                {...inputProps}
                className={`h-11 w-full rounded-lg bg-white pl-10 ${className ?? ''}`}
                aria-label="Search"
            />
        </div>
    );
}
