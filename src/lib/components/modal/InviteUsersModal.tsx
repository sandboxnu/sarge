'use client';

import { useState } from 'react';
import { Link2, X } from 'lucide-react';
import { toast } from 'sonner';
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
import { getInvitableRoles, type OrgRole } from '@/lib/utils/roles.utils';
import { authClient } from '@/lib/auth/auth-client';

type InviteUsersModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organization: { id: string; name: string };
    currentUserRole: OrgRole;
};

export default function InviteUsersModal({
    open,
    onOpenChange,
    organization,
    currentUserRole,
}: InviteUsersModalProps) {
    const invitableRoles = getInvitableRoles(currentUserRole);

    const organizationName = organization.name;
    const [emails, setEmails] = useState<string[]>([]);
    const [role, setRole] = useState<OrgRole>(invitableRoles[0] ?? '');
    const [inviting, setInviting] = useState(false);

    const normalizedEmails = emails
        .flatMap((email) => email.split(','))
        .map((email) => email.trim())
        .filter(Boolean);

    const hasInvalidEmails = getInvalidEmails(normalizedEmails).length > 0;

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

    const handleInvite = async () => {
        if (normalizedEmails.length === 0 || hasInvalidEmails || !role) return;

        try {
            setInviting(true);
            const results = await Promise.allSettled(
                normalizedEmails.map((email) =>
                    authClient.organization.inviteMember({
                        email,
                        role,
                        organizationId: organization.id,
                    })
                )
            );

            const successfulCount = results.filter((r) => r.status === 'fulfilled').length;
            const failedCount = results.filter((r) => r.status === 'rejected').length;
            const failedEmails = normalizedEmails.filter(
                (_, i) => results[i].status === 'rejected'
            );

            if (failedEmails.length > 0) {
                setEmails(failedEmails);
            } else {
                resetState();
            }

            if (successfulCount > 0) {
                const message =
                    normalizedEmails.length > successfulCount
                        ? `Successfully invited ${successfulCount} of ${normalizedEmails.length} user${successfulCount > 1 ? 's' : ''}`
                        : `Successfully invited ${successfulCount} user${successfulCount > 1 ? 's' : ''}`;
                toast.success(message);
            }

            if (failedCount === 0) {
                onOpenChange(false);
            } else {
                toast.error('An error occured... please try again');
            }
        } catch (err) {
            console.error('Error inviting users:', err);
            toast.error('An error occured... please try again');
        } finally {
            setInviting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-[512px] !max-w-[90vw] px-7 py-6" showCloseButton={false}>
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
                                className="gap-1 px-1 text-xs"
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
                        <FieldLabel className="text-label-s font-medium">Invite as</FieldLabel>
                        <Select value={role} onValueChange={(value) => setRole(value as OrgRole)}>
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
                            disabled={emails.length === 0 || hasInvalidEmails || inviting}
                        >
                            {inviting ? 'Inviting...' : 'Invite'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
