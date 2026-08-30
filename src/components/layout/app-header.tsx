import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { BrandMark } from '@/components/shared/brand-mark';
import { useSidebar } from '@/components/ui/sidebar';

export function AppHeader() {
    const { state, toggleSidebar } = useSidebar();
    const collapsed = state === 'collapsed';

    if (collapsed) {
        return (
            <div className="flex h-14 items-center justify-center">
                {/* The rail is 48px wide when collapsed, so the mark and the
                 *  control it hides have to share one slot. The button keeps
                 *  its place in the tab order at opacity 0 and reveals itself
                 *  on focus, so it is not mouse-only. */}
                <div className="group/brand relative flex size-8 items-center justify-center">
                    {/* The two trade places rather than blinking: each fades
                     *  while scaling through the other, on an exponential
                     *  ease-out so the swap settles instead of stopping. The
                     *  global reduced-motion block collapses both. */}
                    <BrandMark
                        variant="icon"
                        className="size-7 scale-100 opacity-100 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within/brand:scale-75 group-focus-within/brand:opacity-0 group-hover/brand:scale-75 group-hover/brand:opacity-0"
                    />
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        aria-label="Expand sidebar"
                        className="absolute inset-0 flex scale-75 cursor-pointer items-center justify-center rounded-md border border-hairline text-text-mid opacity-0 transition-[opacity,transform,color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within/brand:scale-100 group-focus-within/brand:opacity-100 group-hover/brand:scale-100 group-hover/brand:opacity-100 hover:border-hairline-strong hover:text-text-hi"
                    >
                        <PanelLeftOpen className="size-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-14 items-center gap-2">
            {/* pl-3 lines the mark up with the nav icons: the header's own px-2
             *  plus the px-3 each nav row carries */}
            <span className="flex min-w-0 flex-1 items-center pl-3">
                <BrandMark className="h-10 w-auto max-w-full object-left" />
            </span>
            <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                className="mr-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-hairline text-text-mid transition-colors hover:border-hairline-strong hover:text-text-hi"
            >
                <PanelLeftClose className="size-3.5" />
            </button>
        </div>
    );
}
