import React from 'react';
import { Outlet, useLocation } from 'react-router';

import { Search } from 'lucide-react';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    CommandPalette,
    isMacPlatform,
    useCommandPaletteStore,
} from '@/systems/command-palette';
import { useSidebarStore } from '@/stores/sidebar';

import { AppSidebar } from './app-sidebar';
import { UserMenu } from './user-menu';

/** Current group + page title, resolved from the sidebar tree. */
const useCurrentTrail = () => {
    const { pathname } = useLocation();
    const groups = useSidebarStore(store => store.sidebarData);

    for (const group of groups) {
        for (const item of group.items) {
            const sub = item.items?.find(child => pathname.startsWith(child.url));
            if (sub) return { group: group.group, title: sub.title };
            if (pathname.startsWith(item.url)) return { group: group.group, title: item.title };
        }
    }

    return { group: 'Workspace', title: 'Overview' };
};

const LayoutWrapper = () => {
    const trail = useCurrentTrail();
    const openPalette = useCommandPaletteStore(store => store.openPalette);

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 64)',
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset className="m-sheet flex min-h-0 flex-col overflow-hidden bg-transparent">
                <header className="flex h-16 shrink-0 items-center gap-3 px-6">
                    <SidebarTrigger className="-ml-2 md:hidden" />

                    <div className="flex min-w-0 items-center gap-1.5 text-[13px]">
                        <span className="truncate text-text-low">{trail.group}</span>
                        <span className="text-text-low">/</span>
                        <span className="truncate font-medium text-text-hi">{trail.title}</span>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            type="button"
                            onClick={openPalette}
                            className="hidden h-9 w-72 cursor-pointer items-center gap-2 rounded-full border border-hairline bg-surface-1/60 px-3.5 text-[13px] transition-colors hover:border-hairline-strong desk:flex"
                        >
                            <Search className="size-3.5 shrink-0 text-text-low" />
                            <span className="min-w-0 flex-1 text-left text-text-low">Search</span>
                            <kbd className="shrink-0 rounded-sm border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-text-low">
                                {isMacPlatform() ? '⌘K' : 'Ctrl K'}
                            </kbd>
                        </button>

                        <button
                            type="button"
                            onClick={openPalette}
                            aria-label="Search pages"
                            className="flex size-8 items-center justify-center rounded-full border border-hairline text-text-mid transition-colors hover:border-hairline-strong hover:text-text-hi desk:hidden"
                        >
                            <Search className="size-3.5" />
                        </button>

                        <UserMenu />
                    </div>
                </header>

                <CommandPalette />

                <div className="flex-1 overflow-auto px-6 pb-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default LayoutWrapper;
