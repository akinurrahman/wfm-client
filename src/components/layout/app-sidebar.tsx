import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';

import { AppHeader } from './app-header';
import { NavMain } from './nav-main';
import { SidebarSearch } from './sidebar-search';
import { UserMenu } from './user-menu';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            variant="inset"
            collapsible="icon"
            {...props}
        >
            {/* Search rides with the wordmark: it belongs to the sidebar's
             *  chrome, not to the nav list it filters. */}
            <SidebarHeader className="gap-2 px-2 py-0">
                <AppHeader />
                <SidebarSearch />
            </SidebarHeader>
            {/* pt-3, not pt-5: a nav row's own 10px of inner lead already reads
             *  as gap, and only an active row fills it in. */}
            <SidebarContent className="gap-0 px-2 pt-3 pb-4">
                <NavMain />
            </SidebarContent>
            <SidebarFooter className="p-0">
                <UserMenu />
            </SidebarFooter>
        </Sidebar>
    );
}
