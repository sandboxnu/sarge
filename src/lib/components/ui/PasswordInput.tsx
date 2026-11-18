'use client';

import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';
import { cn } from '@/lib/utils/cn.utils';

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        const [visible, setVisible] = useState(false);

        return (
            <div className="relative">
                <Input
                    {...props}
                    ref={ref}
                    type={visible ? 'text' : 'password'}
                    className={cn('w-full pr-10', className)}
                />
                <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    disabled={props.disabled}
                    className="text-sarge-gray-500 hover:text-sarge-gray-800 absolute inset-y-0 right-3 flex items-center disabled:cursor-not-allowed"
                >
                    {visible ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                </button>
            </div>
        );
    }
);
PasswordInput.displayName = 'PasswordInput';
