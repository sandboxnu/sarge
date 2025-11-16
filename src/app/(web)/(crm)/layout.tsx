import { SargeSidebar } from '@/lib/components/SargeSidebar';
import { SidebarInset, SidebarProvider } from '@/lib/components/Sidebar';

export default function CRMLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <SargeSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
