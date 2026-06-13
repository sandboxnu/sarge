import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Our design-system typography classes (text-body-s, text-label-m) share the same
// "text-*" prefix as Tailwind's built-in sizes and colors. tailwind-merge doesn't read
// globals.css, so without this config it misreads tokens like text-body-xs as a color —
// and drops them when paired with text-sarge-gray-500, or fails to replace
// text-lg when a component override passes text-display-xs. we have them as font sizes
const typographyTokens = [
    'display-l',
    'display-m',
    'display-s',
    'display-xs',
    'body-xl',
    'body-l',
    'body-m',
    'body-s',
    'body-xs',
    'label-l',
    'label-m',
    'label-s',
    'label-xs',
] as const;

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': [{ text: [...typographyTokens] }],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
