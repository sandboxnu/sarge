'use client';

import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import MembersTab from '@/lib/components/settings/MembersTab';
import OrganizationTab from '@/lib/components/settings/OrganizationTab';

export default function OrgSettingsPage() {
    return (
        <div className="flex flex-col gap-3 pt-4 pr-5 pb-5 pl-7">
            <div className="flex items-center gap-2">
                <Settings className="size-5 shrink-0" aria-hidden />
                <h1 className="text-display-xs">Settings</h1>
            </div>

            <Tabs defaultValue="members" className="flex flex-col gap-0">
                <TabsList className="border-sarge-gray-200 h-auto w-full justify-start gap-5 rounded-none border-b bg-transparent p-0">
                    <UnderlineTabsTrigger value="members">Members</UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="organization">Organization</UnderlineTabsTrigger>
                </TabsList>

                <TabsContent value="members" className="pt-5">
                    <div className="mx-auto w-full max-w-6xl">
                        <MembersTab />
                    </div>
                </TabsContent>

                <TabsContent value="organization" className="pt-5">
                    <div className="mx-auto w-full max-w-6xl">
                        <OrganizationTab />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
