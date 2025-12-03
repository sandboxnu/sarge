import { SearchIcon } from 'lucide-react';
import { Input } from './Input';

export interface SearchProps {
    className?: string;
    placeholder?: string;
}

export function Search({ className, placeholder }: SearchProps) {
    return (
        <div className="relative h-full w-full">
            <SearchIcon className="text-sarge-gray-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
                type="text"
                placeholder={placeholder ?? 'Search...'}
                className={`w-full rounded-sm pl-10 ${className}`}
                aria-label="Search"
            />
        </div>
    );
}
