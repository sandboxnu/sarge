'use client';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import { cn } from '@/lib/utils/cn.utils';

const PRIMITIVE_TYPES = ['int', 'float', 'string', 'bool', 'char', 'void'];
const ARRAY_TYPES = ['int[]', 'float[]', 'string[]', 'bool[]', 'char[]'];

interface TypeSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export default function TypeSelect({ value, onValueChange, className }: TypeSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn('bg-sarge-gray-0 text-body-s h-11 w-full', className)}>
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Primitives</SelectLabel>
                    {PRIMITIVE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                            {t}
                        </SelectItem>
                    ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Arrays</SelectLabel>
                    {ARRAY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                            {t}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
