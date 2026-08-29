import React, { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PageTitleSlotContext } from '@/components/shared/page-title-slot';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/systems/command-palette';
import { useSidebarStore } from '@/stores/sidebar';

import { AppSidebar } from './app-sidebar';

type Crumb = { label: string; url?: string };

const humanize = (segment: string) =>
    segment.replace(/-/g, ' ').replace(/\b\w/g, character => character.toUpperCase());

/** `/designations/42` and `/designations/8f0c…` carry no readable label, so they
 *  become "Details" rather than a raw id in the trail. */
const isIdSegment = (segment: string) =>
    /^\d+$/.test(segment) || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(segment);

/**
 * Breadcrumb trail for the current route, or `null` on a section's own landing
 * page — there the trail would only repeat the page title sitting right below
 * it, so the header stays a plain utility bar instead.
 */
const useTrail = (): Crumb[] | null => {
    const { pathname } = useLocation();
    const groups = useSidebarStore(store => store.sidebarData);

    return useMemo(() => {
        for (const group of groups) {
            for (const item of group.items) {
                const sub = item.items?.find(child => pathname.startsWith(child.url));
                const matched = sub ?? (pathname.startsWith(item.url) ? item : null);
                if (!matched) continue;

                const rest = pathname.slice(matched.url.length).split('/').filter(Boolean);
                if (rest.length === 0) return null;

                const groupCrumb: Crumb[] = group.group ? [{ label: group.group }] : [];
                const base: Crumb[] = sub
                    ? [
                          ...groupCrumb,
                          { label: item.title, url: item.url },
                          { label: sub.title, url: sub.url },
                      ]
                    : [...groupCrumb, { label: item.title, url: item.url }];

                return [
                    ...base,
                    ...rest.map(segment => ({
                        label: isIdSegment(segment) ? 'Details' : humanize(segment),
                    })),
                ];
            }
        }

        return null;
    }, [groups, pathname]);
};

const Trail = ({ crumbs }: { crumbs: Crumb[] }) => (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
        {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
                <React.Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 && <span className="text-text-low">/</span>}
                    {crumb.url && !isLast ? (
                        <Link
                            to={crumb.url}
                            className="truncate text-text-low transition-colors hover:text-text-hi"
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span
                            aria-current={isLast ? 'page' : undefined}
                            className={
                                isLast ? 'truncate font-medium text-text-hi' : 'truncate text-text-low'
                            }
                        >
                            {crumb.label}
                        </span>
                    )}
                </React.Fragment>
            );
        })}
    </nav>
);

const LayoutWrapper = () => {
    const crumbs = useTrail();
    // Handed to PageHeader so a landing page can claim the bar the trail left
    // empty. Held in state rather than a ref so the portal target is there on
    // the render right after the header mounts.
    const [titleSlot, setTitleSlot] = useState<HTMLDivElement | null>(null);
    // A phone bar is already carrying the sidebar trigger, so the title stays in
    // the page there rather than fighting it for the row.
    const isMobile = useIsMobile();
    const hoistTitle = !crumbs && !isMobile;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 64)',
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset className="flex min-h-0 flex-col overflow-hidden">
                <header
                    /* On a landing page the bar carries the page title
                     * itself, so it grows to fit instead of standing empty
                     * above it. */
                    className={cn(
                        'flex shrink-0 items-center gap-3 px-6',
                        hoistTitle ? 'pt-6 pb-5' : 'h-14'
                    )}
                >
                    <SidebarTrigger className="-ml-2 md:hidden" />

                    {crumbs ? <Trail crumbs={crumbs} /> : null}
                    {hoistTitle ? <div ref={setTitleSlot} className="min-w-0 flex-1" /> : null}

                </header>

                <CommandPalette />

                <PageTitleSlotContext.Provider value={hoistTitle ? titleSlot : null}>
                    <div className="flex-1 overflow-auto px-6 pb-6">
                        <Outlet />
                    </div>
                </PageTitleSlotContext.Provider>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default LayoutWrapper;
