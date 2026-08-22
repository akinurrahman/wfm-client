import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export type DateDisplayFormat =
    | 'PPP' // Jan 5, 2025
    | 'PP' // Jan 5, 2025 (short)
    | 'P' // 01/05/2025
    | 'dd/MM/yyyy' // 05/01/2025
    | 'yyyy-MM-dd'; // 2025-01-05

/** The format the value is serialised to, i.e. what callers receive and store. */
const VALUE_FORMAT = 'yyyy-MM-dd';

interface DatePickerProps {
    date?: string;
    onDateChange?: (value?: string) => void;
    displayFormat?: DateDisplayFormat;
    placeholder?: string;
    disabled?: boolean;
    /** Selectable bounds, in VALUE_FORMAT. Days outside them are greyed out and
     *  unclickable, which is how a screen stops an illegal pick at the source
     *  instead of validating it afterwards. */
    minDate?: string;
    maxDate?: string;
    /** For a picker whose label sits outside the control, e.g. a toolbar pair. */
    ariaLabel?: string;
    className?: string;
}

/** Parses a bound, ignoring anything unparseable rather than disabling the whole
 *  calendar on a typo. */
const toBound = (value?: string) => {
    const parsed = value ? parseISO(value) : undefined;
    return parsed && isValid(parsed) ? parsed : undefined;
};

function DatePicker({
    date,
    onDateChange,
    displayFormat = 'PPP',
    placeholder = 'Pick a date',
    disabled,
    minDate,
    maxDate,
    ariaLabel,
    className,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);

    const parsed = date ? parseISO(date) : undefined;
    const selected = parsed && isValid(parsed) ? parsed : undefined;

    const min = toBound(minDate);
    const max = toBound(maxDate);
    const blocked = [
        ...(min ? [{ before: min }] : []),
        ...(max ? [{ after: max }] : []),
    ];

    const handleSelect = (next?: Date) => {
        onDateChange?.(next ? format(next, VALUE_FORMAT) : undefined);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                disabled={disabled}
                render={
                    <Button
                        data-slot="date-picker-trigger"
                        aria-label={ariaLabel}
                        variant="outline"
                        className={cn(
                            'w-full justify-start gap-2 font-normal',
                            !selected && 'text-muted-foreground',
                            className
                        )}
                    />
                }
            >
                <CalendarIcon size={16} />
                {selected ? format(selected, displayFormat) : placeholder}
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={handleSelect}
                    disabled={blocked.length ? blocked : undefined}
                    defaultMonth={selected ?? max}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}

export { DatePicker }
