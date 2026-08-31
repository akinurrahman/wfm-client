import { dayTypeLookup } from '@/features/attendance';
import { formatDate } from '@/lib/format';
import { formatDuration, toCalendarDate } from '@/lib/time';
import { cn } from '@/lib/utils';

import type { MyDashboardDay } from '../../definitions/my-dashboard.types';
import { useChartHover } from '../../hooks/use-chart-hover';
import { AxisDates } from '../chart-axis';
import { ChartLegend, type LegendEntry } from '../chart-legend';
import { statusLabel, STATUS_FILL, STATUS_HATCH, STATUS_STACK_ORDER } from '../chart-palette';
import { ChartCrosshair, ChartTooltip, TooltipLine } from '../chart-tooltip';

type Props = {
  days: MyDashboardDay[];
};

/** One column per day of the cycle: height is the hours worked, colour is the
 *  status the day was closed with. A day nobody has decided is drawn as a gap,
 *  never as a zero-hour day - those are different statements. */
export function MyDaysChart({ days }: Props) {
  const { active, anchor, bindings } = useChartHover(days.length);

  if (!days.length) return null;

  const maxWorked = Math.max(...days.map(day => day.attendance?.workedMinutes ?? 0), 1);
  const undecided = days.filter(day => !day.attendance).length;

  const entries: LegendEntry[] = STATUS_STACK_ORDER.filter(status =>
    days.some(day => day.attendance?.status === status)
  ).map(status => ({
    key: status,
    label: statusLabel(status),
    className: STATUS_FILL[status],
    style: { backgroundImage: STATUS_HATCH[status] },
  }));

  if (undecided) {
    entries.push({
      key: 'undecided',
      label: 'Not decided',
      className: 'bg-hairline-strong',
      value: undecided,
    });
  }

  const day = active === null ? null : days[active];

  return (
    <figure className="space-y-3">
      <div
        {...bindings}
        role="group"
        aria-label="Hours worked per day across the cycle. Use the arrow keys to read a day."
        className="relative space-y-2 rounded-lg outline-offset-4"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="meta-label text-text-low">Hours a day</h4>
          <span data-numeric className="text-[11px] text-text-low">
            {formatDuration(maxWorked)} at peak
          </span>
        </div>

        {day ? (
          <>
            <ChartCrosshair anchor={anchor} />
            <ChartTooltip anchor={anchor}>
              <DayReading day={day} />
            </ChartTooltip>
          </>
        ) : null}

        <div className="flex h-28 items-end gap-[2px]">
          {days.map((entry, index) => (
            <DayColumn
              key={entry.date}
              day={entry}
              maxWorked={maxWorked}
              isActive={index === active}
              isDimmed={active !== null && index !== active}
            />
          ))}
        </div>

        <div aria-hidden className="h-px w-full bg-hairline" />
        <AxisDates dates={days.map(entry => entry.date)} />
      </div>

      <figcaption>
        <ChartLegend entries={entries} />
      </figcaption>
    </figure>
  );
}

function DayReading({ day }: { day: MyDashboardDay }) {
  const entry = day.attendance;

  return (
    <>
      <p data-numeric className="text-[12px] font-medium text-text-hi">
        {formatDate(toCalendarDate(day.date), 'EEE, dd MMM yyyy')}
      </p>

      {entry ? (
        <>
          <div className="mt-2 flex items-center gap-2">
            <span
              aria-hidden
              style={{ backgroundImage: STATUS_HATCH[entry.status] }}
              className={cn('size-2 shrink-0 rounded-sm', STATUS_FILL[entry.status])}
            />
            <span className="flex-1 truncate text-[12px] text-text-mid">
              {statusLabel(entry.status)}
            </span>
            <span className="text-[12px] text-text-low">
              {dayTypeLookup.resolve(entry.dayType)?.label ?? entry.dayType}
            </span>
          </div>

          <div className="mt-2 space-y-1 border-t border-hairline pt-2">
            <TooltipLine label="Worked" value={formatDuration(entry.workedMinutes)} />
            <TooltipLine label="Late" value={formatDuration(entry.lateMinutes)} />
            <TooltipLine label="Early exit" value={formatDuration(entry.earlyExitMinutes)} />
            <TooltipLine label="Overtime" value={formatDuration(entry.overtimeMinutes)} />
          </div>
        </>
      ) : (
        <p className="mt-1.5 text-[12px] leading-relaxed text-text-mid">
          Nothing has decided this day yet. It is not an absence.
        </p>
      )}
    </>
  );
}

function DayColumn({
  day,
  maxWorked,
  isActive,
  isDimmed,
}: {
  day: MyDashboardDay;
  maxWorked: number;
  isActive: boolean;
  isDimmed: boolean;
}) {
  const entry = day.attendance;

  if (!entry) {
    return (
      <div className="flex h-full min-w-[3px] flex-1 items-end">
        <span
          className={cn(
            'h-[2px] w-full rounded-full bg-hairline-strong transition-opacity',
            isDimmed && 'opacity-45'
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-full min-w-[3px] flex-1 items-end transition-opacity',
        isDimmed && 'opacity-45',
        isActive && 'bg-row-hover'
      )}
    >
      {/* A day worth no hours still carries its status, so the column keeps a
          floor rather than disappearing into the axis. */}
      <span
        style={{
          height: `max(3px, ${(entry.workedMinutes / maxWorked) * 100}%)`,
          backgroundImage: STATUS_HATCH[entry.status],
        }}
        className={cn('w-full rounded-t-[3px]', STATUS_FILL[entry.status])}
      />
    </div>
  );
}
