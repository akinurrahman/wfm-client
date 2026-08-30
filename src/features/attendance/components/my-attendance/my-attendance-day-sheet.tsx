import { parseISO } from 'date-fns';
import { AlertTriangle, PartyPopper } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { plannedAbsenceStatusLookup } from '@/features/leave';
import { formatDate } from '@/lib/format';
import { formatDuration } from '@/lib/time';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import { attendanceStatusLookup, dayTypeLookup } from '../../definitions/attendance.lookup';
import type { MyAttendanceDay } from '../../definitions/my-attendance.types';
import { SummaryFigure, SummarySection } from '../summary-figures';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: MyAttendanceDay | null;
};

const { CANCELLED } = plannedAbsenceStatusLookup.keys;

export function MyAttendanceDaySheet({ open, onOpenChange, day }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-hairline p-5">
          <SheetTitle className="display-title text-lg leading-tight text-text-hi">
            {day ? formatDate(parseISO(day.date), 'EEEE, dd MMM yyyy') : 'Day'}
          </SheetTitle>
          <SheetDescription className="text-[13px] leading-relaxed text-text-mid">
            What the sheet payroll reads holds for this day. Anything wrong here is fixed by your
            admin, not from this screen.
          </SheetDescription>
        </SheetHeader>

        {day ? (
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
            <div className="flex flex-wrap items-center gap-2">
              {day.status ? (
                <LookupBadge lookup={attendanceStatusLookup} value={day.status} />
              ) : null}
              {day.dayType ? <LookupBadge lookup={dayTypeLookup} value={day.dayType} /> : null}
            </div>

            {!day.eligible ? (
              <p className="text-[13px] text-text-mid">
                You were not on rolls on this date, so nothing was counted against it.
              </p>
            ) : !day.attendanceId ? (
              <p className="text-[13px] text-text-mid">
                Nothing has decided this day yet. It is blank, not absent.
              </p>
            ) : null}

            {day.hasConflict ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-overdue/25 bg-overdue-soft px-3.5 py-3 text-[13px] text-text-mid"
              >
                <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0 text-overdue" />
                Two sources disagree about this day, so it is under review. Your admin settles it.
              </p>
            ) : null}

            {day.holidayNames?.length ? (
              <p className="flex items-start gap-2 rounded-lg border border-hairline bg-surface-2 px-3.5 py-3 text-[13px] text-text-mid">
                <PartyPopper aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                {day.holidayNames.join(', ')}
              </p>
            ) : null}

            {day.leave ? (
              <SummarySection title="Charged to leave">
                <SummaryFigure label="Type" value={`${day.leave.name} (${day.leave.code})`} />
                <SummaryFigure label="Paid" value={day.leave.isPaid ? 'Yes' : 'No'} />
                {day.leave.isHalfDay ? <SummaryFigure label="Span" value="Half day" /> : null}
                {day.leave.status === CANCELLED ? (
                  <SummaryFigure
                    label="Note"
                    value="Withdrawn"
                    tone="overdue"
                    hint="The leave was withdrawn. This day goes back to what it was once the reversion runs."
                  />
                ) : null}
              </SummarySection>
            ) : null}

            {day.workedMinutes || day.overtimeMinutes ? (
              <SummarySection title="Time">
                <SummaryFigure label="Worked" value={formatDuration(day.workedMinutes ?? 0)} />
                <SummaryFigure label="Overtime" value={formatDuration(day.overtimeMinutes ?? 0)} />
              </SummarySection>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
