'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import { Button } from '@/lib/components/ui/Button';
import InviteUsersModal from '@/lib/components/modal/InviteUsersModal';
import { useAuth } from '@/lib/auth/auth-context';
import { canInviteMembers, type OrgRole } from '@/lib/utils/roles.utils';

export default function OrgSettingsPage() {
    const { activeMember, activeOrganization } = useAuth();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const currentUserRole = (activeMember?.role ?? 'member') as OrgRole;
    const showInviteButton = canInviteMembers(currentUserRole);

    return (
        <div className="flex flex-col gap-3 pt-4 pr-5 pb-5 pl-7">
            <h1 className="text-display-xs">Organization Settings</h1>

            <Tabs defaultValue="members" className="flex flex-col gap-0">
                <TabsList className="border-sarge-gray-200 h-auto w-full justify-start gap-5 rounded-none border-b bg-transparent p-0">
                    <UnderlineTabsTrigger value="members">Members</UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="candidates">Candidates</UnderlineTabsTrigger>
                </TabsList>

                <TabsContent value="members" className="pt-5">
                    <div className="flex flex-col gap-5">
                        {showInviteButton && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="h-9 px-4"
                                >
                                    <UserPlus className="size-4" />
                                    Invite Members
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="candidates" className="pt-5">
                    <div />
                </TabsContent>
            </Tabs>

            <InviteUsersModal
                open={isInviteModalOpen}
                onOpenChange={setIsInviteModalOpen}
                organization={activeOrganization!}
                currentUserRole={currentUserRole}
            />
        </div>
    );
}
