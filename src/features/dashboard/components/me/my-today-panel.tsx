import { CalendarDays, CircleDashed } from 'lucide-react';

import { attendanceStatusLookup, dayTypeLookup } from '@/features/attendance';
import { formatDate } from '@/lib/format';
import {
  formatDuration,
  instantToClock,
  minutesToTime,
  toCalendarDate,
  weekdayLabel,
} from '@/lib/time';
import { LookupBadge } from '@/systems/ui/lookup-badge';
import { PanelSection } from '@/systems/ui/panel-section';

import type { MyDashboardShift, MyDashboardToday } from '../../definitions/my-dashboard.types';
import { DaySpanChart } from './day-span-chart';

type Props = {
  today: MyDashboardToday;
  /** The shift the day was judged against. Without it the punches have nothing
   *  to be drawn against, so the span is left out rather than invented. */
  shift: MyDashboardShift | null;
  isFuture: boolean;
};

export function MyTodayPanel({ today, shift, isFuture }: Props) {
  const { attendance } = today;

  return (
    <PanelSection
      title="This day"
      description="What the system holds for the date shown, not a calculation made for this screen."
    >
      {/* The shift the day is judged against, kept with the day rather than in a
          strip of its own: the late and overtime figures below are unreadable
          without it, and the span chart is drawn against it. */}
      {shift ? (
        <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-hairline pb-3">
          <Figure
            label={shift.name}
            value={`${minutesToTime(shift.startMinutes)} to ${minutesToTime(shift.endMinutes)}`}
          />
          <Figure label="Break" value={formatDuration(shift.breakMinutes)} />
          <Figure label="Grace" value={formatDuration(shift.graceMinutes)} />
          <Figure
            label="Weekly off"
            value={
              shift.weeklyOffDays.length ? shift.weeklyOffDays.map(weekdayLabel).join(', ') : 'None'
            }
          />
        </dl>
      ) : (
        <p className="text-[13px] text-awaiting">
          No shift assigned, so no day of yours can be judged. Ask HR to set one.
        </p>
      )}

      {today.isHoliday && today.holiday ? (
        <p className="flex items-start gap-2 rounded-lg border border-hairline bg-surface-2 px-3.5 py-3 text-[13px] text-text-mid">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-text-low" />
          <span>
            <span className="font-medium text-text-hi">{today.holiday.names.join(', ')}</span>
            {today.holiday.isOptional ? ' is an optional holiday.' : ' is a holiday.'}
          </span>
        </p>
      ) : null}

      {attendance ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <LookupBadge lookup={attendanceStatusLookup} value={attendance.status} />
            <LookupBadge lookup={dayTypeLookup} value={attendance.dayType} />
            {attendance.hasConflict ? (
              <span className="text-[12px] text-overdue">
                Flagged for review{attendance.conflictNote ? `: ${attendance.conflictNote}` : ''}
              </span>
            ) : null}
          </div>

          {shift ? <DaySpanChart shift={shift} attendance={attendance} /> : null}

          <dl className="flex flex-wrap gap-x-6 gap-y-2.5">
            <Figure label="In" value={instantToClock(attendance.checkIn) ?? '-'} />
            <Figure label="Out" value={instantToClock(attendance.checkOut) ?? '-'} />
            <Figure label="Worked" value={minutes(attendance.workedMinutes)} />
            <Figure
              label="Late"
              value={minutes(attendance.lateMinutes)}
              tone={attendance.lateMinutes ? 'overdue' : undefined}
            />
            <Figure label="Early exit" value={minutes(attendance.earlyExitMinutes)} />
            <Figure label="Overtime" value={minutes(attendance.overtimeMinutes)} />
          </dl>

          {attendance.remark ? (
            <p className="text-[12px] text-text-low">Remark: {attendance.remark}</p>
          ) : null}
        </>
      ) : (
        <div className="flex items-start gap-3 rounded-lg border border-dashed border-hairline-strong px-4 py-3.5">
          <CircleDashed className="mt-0.5 size-4 shrink-0 text-text-low" />
          <div>
            <p className="text-[13px] font-medium text-text-hi">Nothing decided for this day</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-text-mid">
              {isFuture
                ? 'The day has not happened yet. It is decided by the nightly close once it has.'
                : 'A day is decided by the nightly close or by HR. Not decided is not the same as absent.'}
            </p>
          </div>
        </div>
      )}

      {today.plannedAbsence ? (
        <p className="text-[13px] text-text-mid">
          Approved leave covers this day:{' '}
          <span className="font-medium text-text-hi">{today.plannedAbsence.leaveType.name}</span>,{' '}
          <span data-numeric>
            {formatDate(toCalendarDate(today.plannedAbsence.startDate), 'dd MMM')} to{' '}
            {formatDate(toCalendarDate(today.plannedAbsence.endDate), 'dd MMM yyyy')}
          </span>
          .
        </p>
      ) : null}
    </PanelSection>
  );
}

/** A null minute count is "not recorded", which is a different statement from
 *  zero minutes worked. */
const minutes = (value: number | null) => (value === null ? '-' : formatDuration(value));

function Figure({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'overdue';
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="meta-label text-text-low">{label}</dt>
      <dd
        data-numeric
        className={
          tone === 'overdue'
            ? 'text-[14px] font-medium text-overdue'
            : 'text-[14px] font-medium text-text-hi'
        }
      >
        {value}
      </dd>
    </div>
  );
}
