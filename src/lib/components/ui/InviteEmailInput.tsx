'use client';

import { useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string) => emailRegex.test(email);

export const getInvalidEmails = (emails: string[]) =>
    emails.filter((email) => !isValidEmail(email));

type InviteEmailInputProps = {
    emails: string[];
    onEmailsChange: (emails: string[]) => void;
    placeholder?: string;
    hasError?: boolean;
    className?: string;
};

export function InviteEmailInput({
    emails,
    onEmailsChange,
    placeholder = 'Add comma separated emails to invite',
    hasError = false,
    className,
}: InviteEmailInputProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const invalidEmails = useMemo(() => new Set(getInvalidEmails(emails)), [emails]);

    const commitEmails = (rawValues: string[]) => {
        const cleaned = rawValues.map((value) => value.trim()).filter(Boolean);
        if (!cleaned.length) {
            return;
        }
        const seen = new Set(emails.map((email) => email.toLowerCase()));
        const next = [...emails];

        cleaned.forEach((value) => {
            const normalized = value.toLowerCase();
            if (!seen.has(normalized)) {
                next.push(value);
                seen.add(normalized);
            }
        });

        onEmailsChange(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.includes(',')) {
            const parts = value.split(',');
            const trailing = parts.pop() ?? '';
            commitEmails(parts);
            setInputValue(trailing);
            return;
        }
        setInputValue(value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            commitEmails([inputValue]);
            setInputValue('');
            return;
        }
        if (event.key === ',' && inputValue.trim()) {
            event.preventDefault();
            commitEmails([inputValue]);
            setInputValue('');
            return;
        }
        if (event.key === 'Backspace' && inputValue === '' && emails.length > 0) {
            onEmailsChange(emails.slice(0, -1));
        }
    };

    const handleBlur = () => {
        commitEmails([inputValue]);
        setInputValue('');
    };

    const handleRemove = (email: string) => {
        onEmailsChange(emails.filter((value) => value !== email));
    };

    return (
        <div
            className={cn(
                'bg-sarge-gray-50 text-sarge-gray-800 border-sarge-gray-200 hover:border-sarge-gray-300 focus-within:border-sarge-gray-300 flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
                hasError &&
                    'border-sarge-error-700 hover:border-sarge-error-700 focus-within:border-sarge-error-700',
                className
            )}
            onClick={() => inputRef.current?.focus()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    inputRef.current?.focus();
                }
            }}
        >
            {emails.map((email) => {
                const isInvalid = invalidEmails.has(email);
                return (
                    <span
                        key={email}
                        className={cn(
                            'bg-sarge-gray-200 text-sarge-gray-600 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm',
                            isInvalid && 'bg-sarge-error-200 text-sarge-error-700'
                        )}
                    >
                        {email}
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleRemove(email);
                            }}
                            className={cn(
                                'transition-colors hover:opacity-80',
                                isInvalid ? 'text-sarge-error-700' : 'text-sarge-gray-600'
                            )}
                            aria-label={`Remove ${email}`}
                        >
                            <X className="size-3" />
                        </button>
                    </span>
                );
            })}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={emails.length === 0 ? placeholder : undefined}
                className="text-sarge-gray-800 placeholder:text-sarge-gray-500 min-w-[160px] flex-1 bg-transparent text-sm outline-none"
                autoComplete="off"
            />
        </div>
    );
}
