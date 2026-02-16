'use client';

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Chip } from '@/lib/components/ui/Chip';
import { cn } from '@/lib/utils/cn.utils';
import { isValidEmail } from '@/lib/utils/email.utils';

const MAX_CHIP_CHARS = 25;

function truncateEmail(email: string): string {
    if (email.length <= MAX_CHIP_CHARS) return email;
    return `${email.slice(0, MAX_CHIP_CHARS)}…`;
}

type InviteEmailInputProps = {
    emails: string[];
    onEmailsChange: (emails: string[]) => void;
    hasError?: boolean;
    className?: string;
};

export function InviteEmailInput({
    emails,
    onEmailsChange,
    hasError = false,
    className,
}: InviteEmailInputProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const invalidEmails = new Set(emails.filter((email) => !isValidEmail(email)));

    const addEmails = (values: string[]) => {
        const trimmed = values.map((v) => v.trim()).filter(Boolean);
        if (!trimmed.length) return;

        const existing = new Set(emails.map((e) => e.toLowerCase()));
        const deduped = trimmed.filter((v) => {
            const lower = v.toLowerCase();
            if (existing.has(lower)) return false;
            existing.add(lower);
            return true;
        });

        if (deduped.length) {
            onEmailsChange([...emails, ...deduped]);
        }
    };

    const editChip = (email: string) => {
        onEmailsChange(emails.filter((v) => v !== email));
        setInputValue(email);
        inputRef.current?.focus();
    };

    const removeChip = (email: string) => {
        onEmailsChange(emails.filter((v) => v !== email));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value.includes(',')) {
            const parts = value.split(',');
            const trailing = parts.pop() ?? '';
            addEmails(parts);
            setInputValue(trailing);
            return;
        }

        setInputValue(value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || (event.key === ',' && inputValue.trim())) {
            event.preventDefault();
            addEmails([inputValue]);
            setInputValue('');
            return;
        }

        if (event.key === 'Backspace' && inputValue === '' && emails.length > 0) {
            editChip(emails[emails.length - 1]);
        }
    };

    const handleBlur = () => {
        addEmails([inputValue]);
        setInputValue('');
    };

    return (
        <div
            className={cn(
                'bg-sarge-gray-50 text-sarge-gray-800 border-sarge-gray-200 hover:border-sarge-gray-300 focus-within:border-sarge-gray-300 flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors',
                hasError &&
                    'border-sarge-error-700 hover:border-sarge-error-700 focus-within:border-sarge-error-700',
                className
            )}
            onClick={() => inputRef.current?.focus()}
        >
            {emails.map((email) => {
                const isInvalid = invalidEmails.has(email);
                return (
                    <Chip
                        key={email}
                        variant={isInvalid ? 'error' : 'neutral'}
                        className="text-label-s cursor-pointer gap-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            editChip(email);
                        }}
                    >
                        {truncateEmail(email)}
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                removeChip(email);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeChip(email);
                                }
                            }}
                            className={cn(
                                'hover:opacity-80',
                                isInvalid ? 'text-sarge-error-700' : 'text-sarge-gray-600'
                            )}
                        >
                            <X className="size-[14px]" />
                        </span>
                    </Chip>
                );
            })}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={
                    emails.length === 0 ? 'Add comma separated emails to invite' : undefined
                }
                className="text-sarge-gray-800 placeholder:text-sarge-gray-500 min-w-[160px] flex-1 bg-transparent py-1.5 text-sm outline-none"
                autoComplete="off"
            />
        </div>
    );
}
