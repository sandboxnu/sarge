import { SearchIcon } from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';

export interface SearchProps {
    className?: string;
    placeholder?: string;
}

export function Search({ className, placeholder }: SearchProps) {
    return (
        <div className="relative h-full w-full">
            <SearchIcon className="text-sarge-gray-500 absolute top-1/2 left-3 size-5 -translate-y-1/2" />
            <Input
                type="text"
                placeholder={placeholder ?? 'Type to search'}
                className={`text-sarge-gray-500 h-11 w-full rounded-lg bg-white pl-10 italic ${className}`}
                aria-label="Search"
            />
        </div>
    );
}
