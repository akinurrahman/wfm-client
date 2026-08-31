import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDate } from '@/lib/format';
import { shiftCalendarDate, todayCalendarDate } from '@/lib/time';

type Props = {
  /** A `YYYY-MM-DD` calendar date, never an instant. */
  value: string;
  onChange: (date: string) => void;
  ariaLabel: string;
};

/** A day-at-a-time screen is walked forwards, so the arrows carry the routine
 *  and the picker keeps its place for the jumps. */
export function DateStepper({ value, onChange, ariaLabel }: Props) {
  const isToday = value === todayCalendarDate();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous day"
        onClick={() => onChange(shiftCalendarDate(value, -1))}
        className="size-10 cursor-pointer sm:size-8"
      >
        <ChevronLeft />
      </Button>

      <DatePicker
        date={value}
        onDateChange={next => onChange(next ?? todayCalendarDate())}
        ariaLabel={ariaLabel}
        className="h-10 w-auto min-w-52 sm:h-8"
      />

      <Button
        variant="outline"
        size="icon"
        aria-label="Next day"
        onClick={() => onChange(shiftCalendarDate(value, 1))}
        className="size-10 cursor-pointer sm:size-8"
      >
        <ChevronRight />
      </Button>

      {/* Kept on the same baseline as the controls: a caption stacked under the
          picker makes the arrows centre against a two-line block. */}
      <span className="text-[12px] text-text-low">{formatDate(value, 'EEEE')}</span>

      {isToday ? null : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(todayCalendarDate())}
          className="cursor-pointer"
        >
          Today
        </Button>
      )}
    </div>
  );
}
