import type { DefaultValues } from 'react-hook-form';

import { AlertTriangle } from 'lucide-react';

import { useLeaveTypeOptions } from '@/features/leave';
import { instantToClock, minutesToTime } from '@/lib/time';
import {
  ChoiceField,
  FormSheet,
  SelectField,
  TextareaField,
  TimeField,
  type ChoiceOption,
} from '@/systems/form';

import { useSaveAttendanceBulk, useUpdateAttendance } from '../../api/attendance.mutations';
import { REMARK_MAX } from '../../definitions/attendance.constants';
import {
  compensationTypeLookup,
  dayTypeLookup,
  markModeLookup,
  markStatusLookup,
} from '../../definitions/attendance.lookup';
import { markFormSchema, toMarkPayload, type MarkFormValues } from '../../definitions/attendance.schema';
import type { RosterFilters, RosterRow } from '../../definitions/attendance.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Passed through so the write lands in the roster cache entry on screen. */
  filters: RosterFilters;
  /** One row from a row action, or every selected row from the toolbar. */
  targets: RosterRow[];
};

const MODE_OPTIONS: ChoiceOption[] = [
  {
    value: markModeLookup.keys.time,
    label: markModeLookup.config.time.label,
    description: 'The arithmetic runs and decides present, half day or short.',
  },
  {
    value: markModeLookup.keys.status,
    label: markModeLookup.config.status.label,
    description: 'Skips the arithmetic. Times stay empty.',
  },
];

export function MarkAttendanceSheet({ open, onOpenChange, filters, targets }: Props) {
  const single = targets.length === 1 ? targets[0] : null;
  /** An id is the proof a row exists, and the only case PATCH can address. */
  const existingId = single?.attendance?.id ?? null;

  const saveBulk = useSaveAttendanceBulk(filters);
  const updateOne = useUpdateAttendance(filters);
  const mutation = existingId ? updateOne : saveBulk;

  const { data: leaveTypeOptions = [], isLoading: leaveTypesLoading } = useLeaveTypeOptions();

  const withoutShift = targets.filter(row => row.noShiftAssigned);
  /** Compensation is only honoured on a worked holiday or weekly off, so the
   *  field only appears where it would actually be read. */
  const offersCompensation = targets.some(row => row.dayType !== dayTypeLookup.keys.WORKING);

  const plannedAbsence = single?.plannedAbsence ?? null;

  const defaultValues: DefaultValues<MarkFormValues> = {
    mode: plannedAbsence ? markModeLookup.keys.status : markModeLookup.keys.time,
    checkIn: instantToClock(single?.attendance?.checkIn) ?? '',
    checkOut: instantToClock(single?.attendance?.checkOut) ?? '',
    status: plannedAbsence ? markStatusLookup.keys.ON_LEAVE : undefined,
    leaveTypeId: plannedAbsence?.leaveTypeId,
    compensationType: single?.attendance?.compensationType ?? '',
    remark: '',
  };

  const handleSubmit = (values: MarkFormValues) => {
    const payload = toMarkPayload(values);
    const close = () => onOpenChange(false);

    if (existingId) {
      updateOne.mutate({ id: existingId, payload }, { onSuccess: close });
      return;
    }

    saveBulk.mutate(
      {
        date: filters.date,
        entries: targets.map(row => ({ employeeId: row.employee.id, ...payload })),
      },
      { onSuccess: close }
    );
  };

  return (
    <FormSheet<MarkFormValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={targets.map(row => row.employee.id).join('|') || 'none'}
      title={single ? `Mark ${single.employee.fullName}` : `Mark ${targets.length} employees`}
      description="A manual mark overrules the device for this day and is recorded against your account."
      schema={markFormSchema}
      defaultValues={defaultValues}
      submitLabel={existingId ? 'Save correction' : 'Save attendance'}
      isPending={mutation.isPending}
      onSubmit={handleSubmit}
      className="sm:max-w-xl"
    >
      {form => {
        const mode = form.watch('mode');
        const status = form.watch('status');

        return (
          <>
            {single ? <TargetSummary row={single} /> : <BulkSummary count={targets.length} />}

            {withoutShift.length ? (
              <p className="flex items-start gap-2 rounded-lg border border-awaiting/25 bg-awaiting-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-text-mid">
                <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0 text-awaiting" />
                <span>
                  {withoutShift.length === 1
                    ? `${withoutShift[0].employee.fullName} has no shift, so times cannot be judged against anything. Assign a shift first, or set a status instead.`
                    : `${withoutShift.length} of these employees have no shift, so times cannot be judged against anything.`}
                </span>
              </p>
            ) : null}

            <ChoiceField name="mode" label="How to mark it" options={MODE_OPTIONS} />

            {mode === markModeLookup.keys.time ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TimeField
                    name="checkIn"
                    label="Check in"
                    description="Office clock, never converted."
                  />
                  <TimeField
                    name="checkOut"
                    label="Check out"
                    description="Earlier than check in reads as the next morning."
                  />
                </div>

                {offersCompensation ? (
                  <SelectField
                    name="compensationType"
                    label="Compensation"
                    placeholder="None"
                    options={compensationTypeLookup.options}
                    description="Only read on a worked holiday or weekly off."
                  />
                ) : null}
              </>
            ) : (
              <>
                <SelectField
                  name="status"
                  label="Status"
                  placeholder="Pick a status"
                  options={markStatusLookup.options}
                  description="Present and half day are conclusions of the arithmetic, so they cannot be asserted here."
                  required
                />

                {status === markStatusLookup.keys.ON_LEAVE ? (
                  <SelectField
                    name="leaveTypeId"
                    label="Leave type"
                    placeholder={leaveTypesLoading ? 'Loading leave types' : 'Pick a leave type'}
                    options={leaveTypeOptions}
                    disabled={leaveTypesLoading}
                    description="Marking leave also records the planned absence behind it."
                    required
                  />
                ) : null}
              </>
            )}

            <TextareaField
              name="remark"
              label="Remark"
              placeholder="Biometric was down at the east gate"
              maxLength={REMARK_MAX}
              description="Required on every manual mark. It is what the audit trail shows."
              required
            />
          </>
        );
      }}
    </FormSheet>
  );
}

/** The day being decided, restated inside the drawer so the decision is not
 *  made against a row the user can no longer see. */
function TargetSummary({ row }: { row: RosterRow }) {
  const shiftWindow = row.shift
    ? `${minutesToTime(row.shift.startMinutes)} - ${minutesToTime(row.shift.endMinutes)}`
    : 'No shift';

  return (
    <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 rounded-lg border border-hairline bg-surface-2 px-3.5 py-2.5">
      <Fact label="Badge" value={row.employee.employeeId} />
      <Fact label="Shift" value={row.shift ? `${row.shift.code} ${shiftWindow}` : shiftWindow} />
      <Fact label="Day" value={dayTypeLookup.resolve(row.dayType)?.label ?? row.dayType} />
    </dl>
  );
}

function BulkSummary({ count }: { count: number }) {
  return (
    <p className="rounded-lg border border-hairline bg-surface-2 px-3.5 py-2.5 text-[12px] leading-relaxed text-text-mid">
      The same values are written to all <span data-numeric>{count}</span> days. One bad entry
      rejects the whole batch, so nothing is half saved.
    </p>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="meta-label text-text-low">{label}</dt>
      <dd data-numeric className="text-[13px] font-medium text-text-hi">
        {value}
      </dd>
    </div>
  );
}
