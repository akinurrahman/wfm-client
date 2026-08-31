import type { Attendance } from '@/features/attendance';
import { instantToClock, minutesToTime, shiftSpanMinutes, timeToMinutes } from '@/lib/time';
import { cn } from '@/lib/utils';

import type { MyDashboardShift } from '../../definitions/my-dashboard.types';

type Props = {
  shift: MyDashboardShift;
  attendance: Attendance;
};

/** An hour of air either side, so an early arrival or a late exit has somewhere
 *  to be drawn instead of being clamped onto the shift's own edge. */
const PAD_MINUTES = 60;

/** The shift window against the punches that were judged against it. Two spans
 *  on one scale answer "was I late, and by how much" in a way four minute
 *  figures never do. */
export function DaySpanChart({ shift, attendance }: Props) {
  const checkIn = instantToClock(attendance.checkIn);
  if (!checkIn) return null;

  const span = shiftSpanMinutes(shift.startMinutes, shift.endMinutes);
  const windowStart = shift.startMinutes - PAD_MINUTES;
  const length = span + PAD_MINUTES * 2;

  /** Offsets are taken modulo the day so a night shift's 01:00 checkout lands
   *  after its 22:00 start rather than 21 hours before it. */
  const offset = (minutes: number) =>
    Math.min(Math.max((((minutes - windowStart) % 1440) + 1440) % 1440, 0), length);

  const pct = (minutes: number) => (offset(minutes) / length) * 100;

  const checkOut = instantToClock(attendance.checkOut);
  const inAt = timeToMinutes(checkIn);
  const outAt = checkOut ? timeToMinutes(checkOut) : null;

  const start = pct(shift.startMinutes);
  const end = pct(shift.startMinutes + span);
  const actualStart = pct(inAt);
  const actualEnd = outAt === null ? 100 : pct(outAt);
  const isLate = Boolean(attendance.lateMinutes);

  return (
    <figure className="space-y-2">
      <Row label="Shift">
        <span
          title={`${minutesToTime(shift.startMinutes)} to ${minutesToTime(shift.endMinutes)}`}
          className="absolute inset-y-0 rounded-full bg-surface-3"
          style={{ left: `${start}%`, width: `${Math.max(end - start, 0)}%` }}
        />
        {shift.graceMinutes ? (
          <span
            aria-hidden
            title={`Grace ends ${minutesToTime(shift.startMinutes + shift.graceMinutes)}`}
            className="absolute inset-y-0 w-px bg-hairline-strong"
            style={{ left: `${pct(shift.startMinutes + shift.graceMinutes)}%` }}
          />
        ) : null}
      </Row>

      <Row label="You">
        <span
          title={`${checkIn} to ${checkOut ?? 'still open'}`}
          className={cn(
            'absolute inset-y-0 rounded-full',
            isLate ? 'bg-awaiting' : 'bg-settled'
          )}
          style={{
            left: `${actualStart}%`,
            width: `${Math.max(actualEnd - actualStart, 1)}%`,
            // No checkout yet is an open end, not a shorter day, so the tail is
            // hatched rather than simply stopping.
            backgroundImage:
              outAt === null
                ? 'repeating-linear-gradient(45deg, var(--amber) 0 3px, transparent 3px 6px)'
                : undefined,
          }}
        />
      </Row>

      <figcaption className="flex justify-between pl-14">
        <Tick time={minutesToTime(shift.startMinutes)} label="Shift start" />
        <Tick
          time={checkIn}
          label={outAt === null ? 'In, no checkout yet' : `In, out ${checkOut}`}
        />
        <Tick time={minutesToTime(shift.endMinutes)} label="Shift end" align="right" />
      </figcaption>
    </figure>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="meta-label w-11 shrink-0 text-text-low">{label}</span>
      <div className="relative h-2.5 flex-1 rounded-full bg-surface-2">{children}</div>
    </div>
  );
}

function Tick({ time, label, align }: { time: string; label: string; align?: 'right' }) {
  return (
    <span className={cn('flex flex-col', align === 'right' && 'items-end')}>
      <span data-numeric className="text-[12px] font-medium text-text-hi">
        {time}
      </span>
      <span className="text-[11px] text-text-low">{label}</span>
    </span>
  );
}
