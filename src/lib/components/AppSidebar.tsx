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
import { Home, File, ListChecks, Users, Book, Archive, Settings, Dog } from 'lucide-react';
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
            <SidebarHeader>
                <div className="flex items-center gap-3">
                    {/* Avatar/Logo */}
                    <div className="overflow-hidden rounded-sm">
                        {auth.activeOrganization?.logo ? (
                            <Image
                                src={auth.activeOrganization.logo}
                                alt="Organization Logo"
                                width={28}
                                height={28}
                                className="rounded-md object-cover object-center"
                            />
                        ) : (
                            <div className="flex items-center h-[28px] w-[28px] flex-shrink-0 bg-sarge-success-500">
                                <Dog className='text-white h-3 w-3' />
                            </div>
                        )}
                    </div>

                    {/* Organization Details */}
                    <p className="truncate text-xs font-semibold text-gray-900">
                        {auth.activeOrganization?.name ?? 'Organization Name'}
                    </p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:px-1">
                            {sidebarMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className="hover:!bg-sarge-primary-100 focus:!bg-sarge-primary-200 [&:hover]:!bg-sarge-primary-100 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8"
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
                                        >
                                            <item.icon className="!h-[20px] !w-[20x] text-sarge-gray-600" />
                                            <span className="text-xs font-medium text-sarge-gray-800">
                                                {item.title}
                                            </span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Organization Settings"
                            className="hover:!bg-sarge-primary-100 focus:!bg-sarge-primary-200 [&:hover]:!bg-sarge-primary-100 group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:justify-center"
                        >
                            <Settings className="h-6 w-6" />
                            <span className="font-medium text-sarge-gray-800">Organization Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
