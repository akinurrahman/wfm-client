import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { APP_NAME } from '@/constants';
import { useSidebar } from '@/components/ui/sidebar';

export function AppHeader() {
    const { state, toggleSidebar } = useSidebar();
    const collapsed = state === 'collapsed';

    return (
        <div className={`flex h-12 items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
            {/* pl-3 lines the wordmark up with the nav icons: the header's own
             *  px-2 plus the px-3 each nav row carries */}
            {!collapsed && (
                <span className="flex-1 truncate pl-3 font-serif text-2xl leading-none tracking-tight text-text-hi">
                    {APP_NAME}
                </span>
            )}
            <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-hairline text-text-mid transition-colors hover:border-hairline-strong hover:text-text-hi ${
                    collapsed ? '' : 'mr-1 ml-auto'
                }`}
            >
                {collapsed ? (
                    <PanelLeftOpen className="size-3.5" />
                ) : (
                    <PanelLeftClose className="size-3.5" />
                )}
            </button>
        </div>
    );
}
