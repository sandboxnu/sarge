'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/lib/components/Sidebar';
import { Home, File, ListChecks, Users, Book, Archive, Settings, Dog, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import Image from 'next/image';
import useOnboardingState from '@/lib/hooks/useOnboardingState';

const sidebarMenuItems = [
    {
        title: 'Overview',
        url: '/dashboard',
        icon: Home,
    },
    {
        title: 'Assessment Templates',
        url: '#',
        icon: File,
    },
    {
        title: 'Coding Tasks',
        url: '#',
        icon: ListChecks,
    },
    {
        title: 'Positions',
        url: '/positions',
        icon: Users,
    },
    {
        title: 'Live Assessments',
        url: '#',
        icon: Book,
    },
    {
        title: 'Archived Assessments',
        url: '#',
        icon: Archive,
    },
];

export function AppSidebar() {
    const auth = useAuth();

    const { isOnboarding } = useOnboardingState();

    return (
        <Sidebar
            className={`border-sarge-primary-100 bg-sarge-primary-100 border-r-[16px] ${isOnboarding ? 'opacity-0' : ''
                }`}
            collapsible="icon"
        >
            <SidebarHeader className="group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:pb-2">
                <div className="flex items-center gap-3 justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                    <div className="flex items-center gap-2">
                        {/* Avatar/Logo */}
                        <div className="overflow-hidden rounded-sm group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5">
                            {auth.activeOrganization?.logo ? (
                                <Image
                                    src={auth.activeOrganization.logo}
                                    alt="Organization Logo"
                                    width={28}
                                    height={28}
                                    className="rounded-md object-cover object-center"
                                />
                            ) : (
                                <div className="flex justify-center items-center h-7 w-7 flex-shrink-0 bg-sarge-success-500 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5">
                                    <Dog className='text-white h-4 w-4 group-data-[collapsible=icon]:h-3 group-data-[collapsible=icon]:w-3' />
                                </div>
                            )}
                        </div>

                        {/* Organization Details */}
                        <p className="truncate text-xs font-semibold text-gray-900 group-data-[collapsible=icon]:hidden">
                            {auth.activeOrganization?.name ?? 'Organization Name'}
                        </p>
                    </div>

                    <ChevronDown className='text-sarge-gray-600 h-3 w-3 group-data-[collapsible=icon]:hidden' />

                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="group-data-[collapsible=icon]:p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {sidebarMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        className="hover:!bg-sarge-primary-100 focus:!bg-sarge-primary-200 [&:hover]:!bg-sarge-primary-100 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:p-0 !important">
                                        <item.icon className="!h-[20px] !w-[20x] text-sarge-gray-600" />
                                        <span className="text-xs font-medium text-sarge-gray-800">{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent >
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Organization Settings"
                            className="hover:!bg-sarge-primary-100 focus:!bg-sarge-primary-200 [&:hover]:!bg-sarge-primary-100 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:p-0 !important">
                            <Settings className="!h-[20px] !w-[20x] text-sarge-gray-600" />
                            <span className="text-xs font-medium text-sarge-gray-800">Organization Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar >
    );
}
