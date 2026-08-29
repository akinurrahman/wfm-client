import { Search } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { isMacPlatform, useCommandPaletteStore } from '@/systems/command-palette';

/**
 * Global search entry point. Sits at the top of the sidebar so the palette is
 * reachable from the same column as the navigation it searches.
 */
export function SidebarSearch() {
    const openPalette = useCommandPaletteStore(store => store.openPalette);
    const { state, isMobile, setOpenMobile } = useSidebar();
    const collapsed = state === 'collapsed' && !isMobile;

    // On a phone the sidebar is a sheet: leaving it open behind the palette
    // would stack two overlays for one action.
    const handleOpen = () => {
        setOpenMobile(false);
        openPalette();
    };

    if (collapsed) {
        return (
            <div>
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <button
                                type="button"
                                onClick={handleOpen}
                                aria-label="Search"
                                className="flex h-9 w-full cursor-pointer items-center justify-center rounded-md border border-hairline text-text-low transition-colors hover:border-hairline-strong hover:text-text-hi"
                            />
                        }
                    >
                        <Search className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent side="right">Search</TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={handleOpen}
            className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-md border border-hairline bg-surface-1/60 px-3 text-[13px] transition-colors hover:border-hairline-strong"
        >
            <Search className="size-4 shrink-0 text-text-low" />
            <span className="min-w-0 flex-1 truncate text-left text-text-low">Search</span>
            <kbd className="shrink-0 rounded-sm border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-text-low">
                {isMacPlatform() ? '⌘K' : 'Ctrl K'}
            </kbd>
        </button>
    );
}
