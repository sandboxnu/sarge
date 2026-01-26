import { SearchIcon } from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';
import { cn } from '@/lib/utils/cn.utils';

export interface SearchProps {
    className?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Search({ className, placeholder, value, onChange }: SearchProps) {
    return (
        <div className="relative h-full w-full">
            <SearchIcon className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-sarge-gray-500" />
            <Input
                type="text"
                placeholder={placeholder ?? 'Type to search'}
                className={cn(
                    'w-full rounded-lg bg-white pl-10 placeholder:italic',
                    className
                )}
                aria-label="Search"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
