import { Fragment, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';

import { useFilters } from '../hooks/use-filters';
import type { FilterConfig } from '../types';
import { renderFilterField } from '../utils/filter-renderer';

interface FilterPopoverProps {
    config: FilterConfig[];
    /** Search params dropped on every apply, typically the page cursor. */
    resetOnApply?: string[];
    /** Applied to the trigger, so a toolbar can match its own control height. */
    className?: string;
    onTempFilterChange?: (filters: Record<string, string | undefined>) => void;
}

export function FilterPopover({
    config,
    resetOnApply,
    className,
    onTempFilterChange,
}: FilterPopoverProps) {
    const { filters, applyFilters, clearAll, activeCount } = useFilters(config);

    const [open, setOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState(filters);

    // Re-seed the draft from the applied filters every time the popover opens,
    // so an abandoned edit does not survive into the next open.
    const handleOpenChange = (next: boolean) => {
        if (next) setTempFilters(filters);
        setOpen(next);
    };

    useEffect(() => {
        onTempFilterChange?.(tempFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tempFilters]);

    const handleApply = () => {
        applyFilters(tempFilters, resetOnApply);
        setOpen(false);
    };

    const handleClear = () => {
        clearAll();
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger
                aria-label={activeCount > 0 ? `Filters, ${activeCount} applied` : 'Filters'}
                render={<Button variant="outline" className={cn('gap-1.5', className)} />}
            >
                <Filter />
                {/* Inside the button rather than pinned to its corner: a badge
                    that overhangs the trigger gets clipped by whatever the
                    toolbar happens to sit inside. */}
                {activeCount > 0 && (
                    <span
                        aria-hidden
                        className="bg-primary text-primary-foreground flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none"
                    >
                        {activeCount}
                    </span>
                )}
            </PopoverTrigger>

            {/* Never wider than the viewport - a 360px popup on a 375px phone
                would otherwise push the page sideways. */}
            <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-4" align="start">
                <div className="grid grid-cols-2 gap-4">
                    {config.map(item => {
                        if (item.dependsOn && !item.alwaysVisible && !tempFilters[item.dependsOn])
                            return null;
                        return (
                            <Fragment key={item.key}>
                                {renderFilterField(
                                    item,
                                    tempFilters[item.key],
                                    v => {
                                        setTempFilters(prev => {
                                            const next: Record<string, string | undefined> = {
                                                ...prev,
                                                [item.key]: v,
                                            };
                                            const cleared = new Set<string>([item.key]);
                                            let progress = true;
                                            while (progress) {
                                                progress = false;
                                                config.forEach(c => {
                                                    if (
                                                        c.dependsOn &&
                                                        cleared.has(c.dependsOn) &&
                                                        !cleared.has(c.key)
                                                    ) {
                                                        next[c.key] = undefined;
                                                        cleared.add(c.key);
                                                        progress = true;
                                                    }
                                                });
                                            }
                                            return next;
                                        });
                                    },
                                    tempFilters
                                )}
                            </Fragment>
                        );
                    })}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" className="h-10 sm:h-8" onClick={handleClear}>
                        Clear
                    </Button>
                    <Button className="h-10 sm:h-8" onClick={handleApply}>
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
