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
import { Home, File, ListChecks, Users, Book, Archive, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import Image from 'next/image';
import useOnboardingState from '@/lib/hooks/useOnboardingState';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    const { isOnboarding } = useOnboardingState();

    return (
        <Sidebar
            className={`border-sarge-primary-100 bg-sarge-primary-100 border-r-4 ${isOnboarding ? 'opacity-0' : ''
                }`}
            collapsible="icon"
        >
            <SidebarHeader className="group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:pb-2">
                <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center">
                    <div className="flex items-center gap-2">
                        <div
                            className="h-7 w-7 overflow-hidden rounded group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5"
                            style={
                                !auth.activeOrganization?.logo
                                    ? { background: '#858C9C' }
                                    : undefined
                            }
                        >
                            {auth.activeOrganization?.logo ? (
                                <Image
                                    src={auth.activeOrganization.logo}
                                    alt="Organization Logo"
                                    width={28}
                                    height={28}
                                    className="h-full w-full object-cover object-center"
                                />
                            ) : (
                                <Image
                                    src="/Winston Logomark.svg"
                                    alt="Winston Logo"
                                    width={28}
                                    height={28}
                                    className="h-full w-full object-cover object-center brightness-0 invert"
                                />
                            )}
                        </div>

                        <p className="truncate text-xs font-semibold text-gray-900 group-data-[collapsible=icon]:hidden">
                            {auth.activeOrganization?.name ?? 'Organization Name'}
                        </p>
                    </div>

                    <ChevronDown className="text-sarge-gray-600 h-3 w-3 group-data-[collapsible=icon]:hidden" />
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
                                        className="hover:!bg-sarge-primary-100 focus:!bg-sarge-primary-200 [&:hover]:!bg-sarge-primary-100 !important group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:p-0"
                                        onClick={() => router.push(item.url)}
                                    >
                                        <item.icon className="text-sarge-gray-600 !h-4 !w-4" />
                                        <span className="text-sarge-gray-800 text-xs font-medium">
                                            {item.title}
                                        </span>
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
                            className="hover:!bg-sarge-primary-100 focus:!bg-sarge-primary-200 [&:hover]:!bg-sarge-primary-100 !important group-data-[collapsible=icon]:!mx-auto group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:p-0"
                        >
                            <Settings className="text-sarge-gray-600 !h-4 !w-4" />
                            <span className="text-sarge-gray-800 text-xs font-medium">
                                Organization Settings
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
