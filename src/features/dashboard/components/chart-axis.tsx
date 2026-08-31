import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';

type Props = {
  /** Every date in the series, ascending. Both series on this board are gap
   *  filled, so position and date agree and the ends can be read off the array. */
  dates: string[];
};

/** Three ticks, not thirty. A label under every column collides at any window
 *  longer than a fortnight, and the tooltip carries the rest. */
export function AxisDates({ dates }: Props) {
  if (!dates.length) return null;

  const middle = dates[Math.floor((dates.length - 1) / 2)];

  return (
    <div data-numeric className="mt-2 flex justify-between text-[11px] text-text-low">
      <span>{formatDate(toCalendarDate(dates[0]), 'dd MMM')}</span>
      {dates.length > 2 ? <span>{formatDate(toCalendarDate(middle), 'dd MMM')}</span> : null}
      <span>{formatDate(toCalendarDate(dates[dates.length - 1]), 'dd MMM')}</span>
    </div>
  );
}
