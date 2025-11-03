'use client';

import {
    type LucideIcon,
    Settings,
    House,
    BookOpen,
    Users,
    ChevronDown,
    ListChecks,
    File,
    Archive,
} from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/auth/auth-client';

export type NavItem = {
    title: string;
    icon: LucideIcon;
    href?: string;
    isActive?: boolean;
};

const SidebarContext = createContext<{
    isCollapsed: boolean;
    toggleCollapse: () => void;
}>({
    isCollapsed: false,
    toggleCollapse: () => {},
});

const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
};

// Organization Dropdown Component
function OrgDropdown() {
    const { isCollapsed } = useSidebar();
    const auth = useAuth();

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center justify-center p-2">
                            <div className="bg-sarge-gray-200 h-8 w-8 rounded-xl" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{auth.user.orgName ?? 'Organization Name'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <div className="p-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="hover:bg-sarge-primary-100 h-auto w-full justify-between p-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-sarge-gray-200 h-8 w-8 rounded-xl" />
                            <div className="flex flex-col items-start">
                                <span className="text-sarge-gray-800 text-sm font-semibold">
                                    {auth.user.orgName ?? 'Organization Name'}
                                </span>
                                <span className="text-sarge-gray-600 text-xs">
                                    {auth.user.orgId ?? 'Org Id'}
                                </span>
                            </div>
                        </div>
                        <ChevronDown className="text-sarge-gray-600 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem>Switch Organization</DropdownMenuItem>
                    <DropdownMenuItem>Create New Organization</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Organization Settings</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

// Navigation Item Component
function NavItem({ item }: { item: NavItem }) {
    const { isCollapsed } = useSidebar();
    const Icon = item.icon;

    if (isCollapsed) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-10 w-10 ${
                                item.isActive
                                    ? 'bg-sarge-primary-100 hover:bg-sarge-primary-200'
                                    : 'hover:bg-sarge-primary-100'
                            }`}
                            asChild
                        >
                            <a href={item.href}>
                                <Icon
                                    className={`h-5 w-5 ${item.isActive ? 'text-sarge-primary-600' : 'text-sarge-gray-600'}`}
                                />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>{item.title}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Button
            variant="ghost"
            className={`h-10 w-full justify-start px-3 ${
                item.isActive
                    ? 'bg-sarge-primary-100 text-sarge-primary-700 hover:bg-sarge-primary-200'
                    : 'text-sarge-gray-800 hover:bg-sarge-primary-100'
            }`}
            asChild
        >
            <a href={item.href}>
                <Icon
                    className={`mr-3 h-5 w-5 ${item.isActive ? 'text-sarge-primary-600' : 'text-sarge-gray-600'}`}
                />
                <span>{item.title}</span>
            </a>
        </Button>
    );
}

// Main Sidebar Component
export default function SideNav() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const navItems: NavItem[] = [
        {
            title: 'Overview',
            icon: House,
            href: '/dashboard',
            isActive: true,
        },
        {
            title: 'Assessment Templates',
            icon: File,
            href: '/templates',
        },
        {
            title: 'Coding Tasks',
            icon: ListChecks,
            href: '/tasks',
        },
        {
            title: 'Positions',
            icon: Users,
            href: '/positions',
        },
        {
            title: 'Live Assessments',
            icon: BookOpen,
            href: '/assessments/live',
        },
        {
            title: 'Archived Assessments',
            icon: Archive,
            href: '/assessments/archived',
        },
    ];

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
            <div
                className={`bg-sarge-gray-50 relative flex h-full flex-col justify-between border-r transition-all duration-300 ${
                    isCollapsed ? 'w-16' : 'w-64'
                }`}
            >
                <div className="flex flex-col">
                    <OrgDropdown />
                    <nav className="flex flex-col gap-1 p-2">
                        {navItems.map((item) => (
                            <NavItem key={item.title} item={item} />
                        ))}
                    </nav>
                </div>

                <div className="p-2">
                    <NavItem
                        item={{
                            title: 'Organization Settings',
                            icon: Settings,
                            href: '/settings',
                        }}
                    />
                </div>

                {/* Collapse Rail */}
                <button
                    onClick={toggleCollapse}
                    className="hover:bg-sarge-gray-200/50 group absolute inset-y-0 -right-2 flex w-4 items-center justify-center bg-transparent transition-colors"
                    aria-label="Toggle sidebar"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <div className="bg-sarge-gray-300 group-hover:bg-sarge-gray-600 h-6 w-0.5 rounded-full transition-colors" />
                </button>
            </div>
        </SidebarContext.Provider>
    );
}
