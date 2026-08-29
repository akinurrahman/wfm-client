import { useMemo } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FilterSelect } from '@/systems/filters';

import {
  MONTH_OPTIONS,
  monthlyYearOptions,
  shiftCycle,
} from '../definitions/attendance-monthly.constants';

type Props = {
  year: number;
  month: number;
  onChange: (cycle: { year: number; month: number }) => void;
};

/** Picks the cycle every attendance month is read against. The label is not the
 *  window: a 26th-to-25th cycle labelled August starts in July. */
export function CyclePicker({ year, month, onChange }: Props) {
  const yearOptions = useMemo(() => monthlyYearOptions(), []);

  const now = new Date();
  const isThisMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    // The two selects carry `w-full` on a phone, so they only share a line once
    // they are flex children with a basis of their own.
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous month"
        onClick={() => onChange(shiftCycle(year, month, -1))}
        className="size-10 shrink-0 cursor-pointer sm:size-8"
      >
        <ChevronLeft />
      </Button>

      <FilterSelect
        value={String(month)}
        onChange={value => onChange({ year, month: Number(value) })}
        options={MONTH_OPTIONS}
        placeholder="Month"
        clearable={false}
        className="min-w-0 flex-1 sm:min-w-36 sm:flex-none"
      />

      <FilterSelect
        value={String(year)}
        onChange={value => onChange({ year: Number(value), month })}
        options={yearOptions}
        placeholder="Year"
        clearable={false}
        className="w-22 min-w-0 shrink-0 sm:w-auto sm:min-w-28"
      />

      <Button
        variant="outline"
        size="icon"
        aria-label="Next month"
        onClick={() => onChange(shiftCycle(year, month, 1))}
        className="size-10 shrink-0 cursor-pointer sm:size-8"
      >
        <ChevronRight />
      </Button>

      {isThisMonth ? null : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ year: now.getFullYear(), month: now.getMonth() + 1 })}
          className="h-10 w-full cursor-pointer sm:h-8 sm:w-auto"
        >
          This month
        </Button>
      )}
    </div>
  );
}
