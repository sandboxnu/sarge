'use client';

import { useState } from 'react';
import { Link2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import { Field, FieldLabel } from '@/lib/components/ui/Field';
import { InviteEmailInput } from '@/lib/components/ui/InviteEmailInput';
import { getInvalidEmails } from '@/lib/utils/email.utils';
import { getInvitableRoles, ROLE_DISPLAY_NAMES, type OrgRole } from '@/lib/utils/roles.utils';

type InviteUsersModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationName?: string;
    currentUserRole: OrgRole;
};

export default function InviteUsersModal({
    open,
    onOpenChange,
    organizationName = 'Organization Name',
    currentUserRole,
}: InviteUsersModalProps) {
    const invitableRoles = getInvitableRoles(currentUserRole);

    const [emails, setEmails] = useState<string[]>([]);
    const [role, setRole] = useState<string>(invitableRoles[0] ?? '');

    const hasInvalidEmails = getInvalidEmails(emails).length > 0;

    const resetState = () => {
        setEmails([]);
        setRole(invitableRoles[0] ?? '');
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            resetState();
        }
        onOpenChange(nextOpen);
    };

    const handleInvite = () => {
        // TODO: wire up to actual invite API (#222)
        resetState();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-[512px] !max-w-[90vw] px-7 py-6"
                showCloseButton={false}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-display-xs">
                            Invite users to {organizationName}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="tertiary"
                                disabled
                                className="text-xs gap-1 px-1"
                            >
                                <Link2 className="size-5" />
                                Copy link
                            </Button>
                            <Button
                                type="button"
                                variant="icon"
                                onClick={() => handleOpenChange(false)}
                                aria-label="Close invite modal"
                            >
                                <X className="size-5" />
                            </Button>
                        </div>
                    </div>

                    <Field className="gap-2">
                        <div className="flex items-center gap-3">
                            <FieldLabel className="text-label-s font-medium">
                                Invitee emails
                            </FieldLabel>
                            {hasInvalidEmails && (
                                <span className="text-label-xs text-sarge-error-700">
                                    Invalid email(s)
                                </span>
                            )}
                        </div>
                        <InviteEmailInput
                            emails={emails}
                            onEmailsChange={setEmails}
                            hasError={hasInvalidEmails}
                        />
                    </Field>

                    <Field className="gap-2">
                        <FieldLabel className="text-label-s font-medium">
                            Invite as
                        </FieldLabel>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="h-11 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {invitableRoles.map((roleOption) => (
                                    <SelectItem key={roleOption} value={roleOption}>
                                        {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
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
