'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Link2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { InviteEmailInput, getInvalidEmails } from '@/lib/components/ui/InviteEmailInput';
import { cn } from '@/lib/utils/cn.utils';

const roles = ['Admin', 'Recruiter', 'Viewer'] as const;
type InviteRole = (typeof roles)[number];

type InviteUsersModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationName?: string;
};

export default function InviteUsersModal({
    open,
    onOpenChange,
    organizationName = 'Organization Name',
}: InviteUsersModalProps) {
    const [emails, setEmails] = useState<string[]>([]);
    const [role, setRole] = useState<InviteRole>('Admin');
    const [copied, setCopied] = useState(false);

    const invalidEmails = useMemo(() => getInvalidEmails(emails), [emails]);

    const resetState = () => {
        setEmails([]);
        setRole('Admin');
        setCopied(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            resetState();
        }
        onOpenChange(nextOpen);
    };

    const inviteLink = 'https://sarge.ai/invite';

    const handleCopyLink = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(inviteLink);
            }
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleInvite = () => {
        resetState();
        onOpenChange(false);
    };

    const hasInvalidEmails = invalidEmails.length > 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-[640px] !max-w-[90vw] gap-6 px-8 py-6"
                showCloseButton={false}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                        <DialogTitle className="text-display-xs text-sarge-gray-800 font-bold">
                            Invite users to {organizationName}
                        </DialogTitle>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className={cn(
                                    'text-label-s flex items-center gap-2 font-medium transition-colors',
                                    copied
                                        ? 'text-sarge-primary-600'
                                        : 'text-sarge-primary-600 hover:text-sarge-primary-700'
                                )}
                            >
                                {copied ? (
                                    <Check className="size-4" />
                                ) : (
                                    <Link2 className="size-4" />
                                )}
                                {copied ? 'Link copied' : 'Copy link'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOpenChange(false)}
                                className="hover:bg-sarge-gray-200 rounded p-1 transition-colors"
                                aria-label="Close invite modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-label-s text-sarge-gray-800 font-medium">
                                Invitee emails
                            </span>
                            {hasInvalidEmails && (
                                <span className="text-label-xs text-sarge-error-700 font-medium">
                                    Invalid email(s)
                                </span>
                            )}
                        </div>
                        <InviteEmailInput
                            emails={emails}
                            onEmailsChange={setEmails}
                            hasError={hasInvalidEmails}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-label-s text-sarge-gray-800 font-medium">
                            Invite as
                        </span>
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(event) => setRole(event.target.value as InviteRole)}
                                className="bg-sarge-gray-50 text-sarge-gray-800 border-sarge-gray-200 hover:border-sarge-gray-300 focus:border-sarge-gray-300 h-11 w-full appearance-none rounded-lg border px-3 py-1 pr-10 text-sm transition-colors focus:outline-none"
                            >
                                {roles.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="text-sarge-gray-600 pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => handleOpenChange(false)}
                            className="text-label-s text-sarge-primary-600 hover:text-sarge-primary-700 px-0 py-2 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleInvite}
                            className="h-9 w-[125px] px-4 py-2"
                            disabled={emails.length === 0 || hasInvalidEmails}
                        >
                            Invite
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
