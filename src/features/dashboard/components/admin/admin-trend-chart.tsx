import { formatDate } from '@/lib/format';
import { formatDuration, toCalendarDate } from '@/lib/time';
import { cn } from '@/lib/utils';

import type { AdminTrend, AdminTrendPoint } from '../../definitions/admin-dashboard.types';
import { useChartHover } from '../../hooks/use-chart-hover';
import { AxisDates } from '../chart-axis';
import { ChartLegend, type LegendEntry } from '../chart-legend';
import { statusLabel, STATUS_FILL, STATUS_HATCH, STATUS_STACK_ORDER } from '../chart-palette';
import { ChartCrosshair, ChartTooltip, TooltipLine } from '../chart-tooltip';

type Props = {
  trend: AdminTrend;
};

/** One measure per plot: the stack is a head count, and site hours differ from
 *  it by two orders, so the hours read off the tooltip and the peak line rather
 *  than off a second axis that would invent a correlation. */
export function AdminTrendChart({ trend }: Props) {
  const series = trend.series;
  const { active, anchor, bindings } = useChartHover(series.length);

  if (!series.length) return null;

  const maxMarked = Math.max(...series.map(point => point.marked), 1);
  const peak = series.reduce((best, entry) =>
    entry.workedMinutes > best.workedMinutes ? entry : best
  );

  const entries: LegendEntry[] = STATUS_STACK_ORDER.filter(status =>
    series.some(point => (point.byStatus[status] ?? 0) > 0)
  ).map(status => ({
    key: status,
    label: statusLabel(status),
    className: STATUS_FILL[status],
    style: { backgroundImage: STATUS_HATCH[status] },
  }));

  const point = active === null ? null : series[active];

  return (
    <div className="space-y-4">
      <div
        {...bindings}
        role="group"
        aria-label={`Site attendance for the ${trend.days} days ending ${formatDate(toCalendarDate(trend.to), 'dd MMM yyyy')}. Use the arrow keys to read a day.`}
        className="relative space-y-2 rounded-lg outline-offset-4"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="meta-label text-text-low">Attendance mix</h4>
          <span data-numeric className="text-[11px] text-text-low">
            {maxMarked} decided at peak
          </span>
        </div>

        {point ? (
          <>
            <ChartCrosshair anchor={anchor} />
            <ChartTooltip anchor={anchor}>
              <TrendReading point={point} />
            </ChartTooltip>
          </>
        ) : null}

        <div className="flex h-36 items-end gap-[2px]">
          {series.map((entry, index) => (
            <TrendColumn
              key={entry.date}
              point={entry}
              maxMarked={maxMarked}
              isActive={index === active}
              isDimmed={active !== null && index !== active}
            />
          ))}
        </div>

        <div aria-hidden className="h-px w-full bg-hairline" />
        <AxisDates dates={series.map(entry => entry.date)} />
      </div>

      <ChartLegend entries={entries} />

      {/* The extreme, labelled directly: without it the site's hours would be
          readable only by hovering, and a tooltip must not be the only way to
          reach a number. */}
      <p data-numeric className="text-[12px] text-text-low">
        Worked hours peaked at {formatDuration(peak.workedMinutes)} on{' '}
        {formatDate(toCalendarDate(peak.date), 'EEE dd MMM')}. Hold a day for its own hours, late
        and overtime.
      </p>
    </div>
  );
}

function TrendReading({ point }: { point: AdminTrendPoint }) {
  const statuses = STATUS_STACK_ORDER.filter(status => point.byStatus[status] > 0);

  return (
    <>
      <p data-numeric className="text-[12px] font-medium text-text-hi">
        {formatDate(toCalendarDate(point.date), 'EEE, dd MMM yyyy')}
      </p>

      {point.marked ? (
        <>
          <dl className="mt-2 space-y-1">
            {statuses.map(status => (
              <div key={status} className="flex items-center gap-2">
                <span
                  aria-hidden
                  style={{ backgroundImage: STATUS_HATCH[status] }}
                  className={cn('size-2 shrink-0 rounded-sm', STATUS_FILL[status])}
                />
                <dt className="flex-1 truncate text-[12px] text-text-mid">
                  {statusLabel(status)}
                </dt>
                <dd data-numeric className="text-[12px] font-medium text-text-hi">
                  {point.byStatus[status]}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-2 space-y-1 border-t border-hairline pt-2">
            <TooltipLine label="Decided" value={String(point.marked)} />
            <TooltipLine label="Worked" value={formatDuration(point.workedMinutes)} />
            <TooltipLine label="Late" value={formatDuration(point.lateMinutes)} />
            <TooltipLine label="Overtime" value={formatDuration(point.overtimeMinutes)} />
          </div>
        </>
      ) : (
        <p className="mt-1.5 text-[12px] leading-relaxed text-text-mid">
          Nothing was recorded on this day. That is not a day of absences.
        </p>
      )}
    </>
  );
}

function TrendColumn({
  point,
  maxMarked,
  isActive,
  isDimmed,
}: {
  point: AdminTrendPoint;
  maxMarked: number;
  isActive: boolean;
  isDimmed: boolean;
}) {
  // A day nothing was recorded on is a real statement, so it keeps its slot and
  // shows a baseline mark rather than vanishing into the gap beside it.
  if (!point.marked) {
    return (
      <div className="flex h-full min-w-[2px] flex-1 items-end">
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
        'flex h-full min-w-[2px] flex-1 items-end transition-opacity',
        isDimmed && 'opacity-45',
        isActive && 'bg-row-hover'
      )}
    >
      {/* Height carries the count, so it is set on the stack itself: a
          percentage padding would resolve against the column's width. */}
      <div
        className="flex w-full flex-col-reverse gap-[2px]"
        style={{ height: `${(point.marked / maxMarked) * 100}%` }}
      >
        {STATUS_STACK_ORDER.filter(status => point.byStatus[status] > 0).map(status => (
          <span
            key={status}
            style={{ flexGrow: point.byStatus[status], backgroundImage: STATUS_HATCH[status] }}
            className={cn(
              'w-full basis-0 first:rounded-b-[2px] last:rounded-t-[3px]',
              STATUS_FILL[status]
            )}
          />
        ))}
      </div>
    </div>
  );
}
