import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';

import { AppHeader } from './app-header';
import { NavMain } from './nav-main';
import { ThemeSwitcher } from './theme-switcher';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            variant="inset"
            collapsible="icon"
            {...props}
        >
            <SidebarHeader className="p-0">
                <AppHeader />
            </SidebarHeader>
            <SidebarContent className="gap-0 px-2 py-4">
                <NavMain />
            </SidebarContent>
            <SidebarFooter className="p-0">
                <ThemeSwitcher />
            </SidebarFooter>
        </Sidebar>
    );
}
