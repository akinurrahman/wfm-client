import { useNavigate } from 'react-router';

import { CornerDownLeft, Search } from 'lucide-react';

import { resolveNavIcon } from '@/systems/ui/nav-icon';

import { useCommandHotkey } from '../hooks/use-command-hotkey';
import { useCommandItems } from '../hooks/use-command-items';
import { useCommandSearch } from '../hooks/use-command-search';
import { useCommandPaletteStore } from '../store';
import { type CommandItem } from '../types';

export function CommandPalette() {
    useCommandHotkey();

    const open = useCommandPaletteStore(store => store.open);
    const closePalette = useCommandPaletteStore(store => store.closePalette);

    const navigate = useNavigate();
    const items = useCommandItems();
    const { query, setQuery, results, activeIndex, activeItem, setHighlighted, moveHighlight, reset } =
        useCommandSearch(items);

    if (!open) return null;

    const dismiss = () => {
        reset();
        closePalette();
    };

    const run = (item?: CommandItem) => {
        if (!item) return;
        dismiss();
        navigate(item.url);
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveHighlight(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveHighlight(-1);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            run(activeItem);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            dismiss();
        }
    };

    // z-[60] clears the mobile sidebar sheet, which portals in at z-50 after
    // this node and would otherwise stack over it.
    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
            <button
                type="button"
                aria-label="Close search"
                onClick={dismiss}
                className="absolute inset-0 cursor-default bg-[var(--scrim)] backdrop-blur-[3px]"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Search pages"
                onKeyDown={onKeyDown}
                className="m-panel m-panel-shine relative z-10 w-full max-w-xl overflow-hidden shadow-lift"
            >
                <div className="flex items-center gap-3 border-b border-hairline px-4 py-3.5">
                    <Search className="size-4 shrink-0 text-text-low" />
                    <input
                        autoFocus
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search pages"
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-text-hi placeholder:text-text-low focus:outline-none"
                    />
                    <kbd className="shrink-0 rounded-sm border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-text-low">
                        esc
                    </kbd>
                </div>

                <div className="max-h-80 overflow-y-auto p-1.5">
                    {results.length === 0 ? (
                        <p className="px-3 py-8 text-center text-[13px] text-text-low">
                            No pages match “{query}”
                        </p>
                    ) : (
                        results.map((item, index) => {
                            const Icon = resolveNavIcon(item.icon);
                            const isActive = index === activeIndex;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    ref={
                                        isActive
                                            ? node => {
                                                  node?.scrollIntoView({ block: 'nearest' });
                                              }
                                            : undefined
                                    }
                                    onMouseMove={() => setHighlighted(index)}
                                    onClick={() => run(item)}
                                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                                        isActive ? 'bg-surface-3' : ''
                                    }`}
                                >
                                    <Icon
                                        className={`size-4 shrink-0 ${isActive ? 'text-brand' : 'text-text-low'}`}
                                    />
                                    <span className="min-w-0 flex-1 truncate text-[13px] text-text-hi">
                                        {item.parent ? `${item.parent} · ` : ''}
                                        {item.title}
                                    </span>
                                    <span className="shrink-0 text-[11px] text-text-low">
                                        {item.group}
                                    </span>
                                    {isActive && (
                                        <CornerDownLeft className="size-3.5 shrink-0 text-text-low" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="flex items-center gap-4 border-t border-hairline px-4 py-2.5 text-[11px] text-text-low">
                    <span>↑↓ navigate</span>
                    <span>↵ open</span>
                    <span className="ml-auto">
                        {results.length} {results.length === 1 ? 'page' : 'pages'}
                    </span>
                </div>
            </div>
        </div>
    );
}
