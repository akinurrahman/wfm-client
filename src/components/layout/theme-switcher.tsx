import { useTheme } from 'next-themes';
import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';

const MODES: { value: string; label: string; hint: string; icon: LucideIcon }[] = [
    { value: 'light', label: 'Light', hint: 'Daytime ledger', icon: Sun },
    { value: 'dark', label: 'Dark', hint: 'Low-light desk', icon: Moon },
    { value: 'system', label: 'System', hint: 'Match device', icon: Monitor },
];

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const { state, isMobile } = useSidebar();
    const collapsed = state === 'collapsed' && !isMobile;

    const active = MODES.find(mode => mode.value === theme) ?? MODES[1];
    const ActiveIcon = active.icon;

    return (
        <div className={collapsed ? 'p-1.5' : 'px-2 pt-2 pb-3'}>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button
                            type="button"
                            aria-label="Change appearance"
                            className={`m-panel w-full cursor-pointer text-left transition-colors hover:border-hairline-strong data-popup-open:border-brand-line ${
                                collapsed
                                    ? 'flex justify-center px-1.5 py-1.5'
                                    : 'm-panel-shine px-3 py-2.5'
                            }`}
                        />
                    }
                >
                    <span className="flex items-center gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                            <ActiveIcon className="size-3.5" />
                        </span>
                        {!collapsed && (
                            <span className="grid flex-1 leading-tight">
                                <span className="truncate text-[13px] font-medium text-text-hi">
                                    Appearance
                                </span>
                                <span className="truncate text-[11px] text-text-low">
                                    {active.label} mode
                                </span>
                            </span>
                        )}
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side="top"
                    align="start"
                    sideOffset={8}
                    className="w-56 min-w-56 border border-hairline bg-surface-2 p-1.5 shadow-lift ring-0"
                >
                    <p className="px-2 pt-1 pb-2 text-[10px] tracking-[0.16em] text-text-low uppercase">
                        Appearance
                    </p>
                    {MODES.map(mode => {
                        const Icon = mode.icon;
                        const isActive = theme === mode.value;

                        return (
                            <DropdownMenuItem
                                key={mode.value}
                                onClick={() => setTheme(mode.value)}
                                className="gap-2.5 rounded-md px-2 py-2 focus:bg-surface-3"
                            >
                                <Icon className="size-4 text-text-mid" />
                                <span className="grid flex-1 leading-tight">
                                    <span className="text-[13px] text-text-hi">{mode.label}</span>
                                    <span className="text-[11px] text-text-low">{mode.hint}</span>
                                </span>
                                {isActive && <Check className="size-3.5 text-brand" />}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
