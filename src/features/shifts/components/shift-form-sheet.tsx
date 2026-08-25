import type { DefaultValues } from 'react-hook-form';

import {
  formatDuration,
  isNightShift,
  shiftSpanMinutes,
  TIME_PATTERN,
  timeToMinutes,
  WEEKDAYS,
} from '@/lib/time';
import { FormSheet, InputField, SelectField, SwitchField, TimeField } from '@/systems/form';

import { useCreateShift, useUpdateShift } from '../api/shift.mutations';
import { SHIFT_CODE_MAX, SHIFT_NAME_MAX } from '../definitions/shift.constants';
import { shiftFormSchema, toShiftPayload, type ShiftFormValues } from '../definitions/shift.schema';
import type { Shift } from '../definitions/shift.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift?: Shift;
};

/** A general shift, so the blank form starts somewhere useful rather than empty. */
const CREATE_DEFAULTS: DefaultValues<ShiftFormValues> = {
  startTime: '09:00',
  endTime: '18:00',
  breakMinutes: 60,
  graceMinutes: 10,
  weeklyOffDays: ['0'],
  isActive: true,
};

const WEEKDAY_OPTIONS = WEEKDAYS.map(day => ({ value: day.value, label: day.label }));

export function ShiftFormSheet({ open, onOpenChange, shift }: Props) {
  const isEdit = Boolean(shift);

  const createShift = useCreateShift();
  const updateShift = useUpdateShift(shift?.id ?? '');
  const mutation = isEdit ? updateShift : createShift;

  const defaultValues: DefaultValues<ShiftFormValues> = shift
    ? {
        name: shift.name,
        code: shift.code,
        startTime: shift.startTime,
        endTime: shift.endTime,
        breakMinutes: shift.breakMinutes,
        graceMinutes: shift.graceMinutes,
        weeklyOffDays: shift.weeklyOffDays.map(String),
        isActive: shift.isActive,
      }
    : CREATE_DEFAULTS;

  return (
    <FormSheet<ShiftFormValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={shift?.id ?? 'new'}
      title={isEdit ? `Edit ${shift?.name}` : 'New shift'}
      description="Attendance is measured against these hours, so a shift has to exist before anyone can be rostered onto it."
      schema={shiftFormSchema}
      defaultValues={defaultValues}
      submitLabel={isEdit ? 'Save changes' : 'Create shift'}
      isPending={mutation.isPending}
      onSubmit={values =>
        mutation.mutate(toShiftPayload(values), { onSuccess: () => onOpenChange(false) })
      }
      className="sm:max-w-2xl"
    >
      {form => {
        const start = form.watch('startTime') ?? '';
        const end = form.watch('endTime') ?? '';
        const breakMinutes = form.watch('breakMinutes') ?? 0;

        // A half-typed time reads as NaN, so the summary waits until both
        // fields are whole and describe a real span.
        const complete = TIME_PATTERN.test(start) && TIME_PATTERN.test(end) && start !== end;
        const startMinutes = complete ? timeToMinutes(start) : 0;
        const endMinutes = complete ? timeToMinutes(end) : 0;
        const span = complete ? shiftSpanMinutes(startMinutes, endMinutes) : 0;

        return (
          <>
            <Section title="Identity">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  name="name"
                  label="Name"
                  placeholder="General Shift"
                  maxLength={SHIFT_NAME_MAX}
                  required
                />
                <InputField
                  name="code"
                  label="Code"
                  placeholder="GEN"
                  maxLength={SHIFT_CODE_MAX}
                  description="Short and unique. Uppercased on save."
                  required
                />
              </div>
            </Section>

            <Section title="Hours">
              <div className="grid gap-4 sm:grid-cols-2">
                <TimeField name="startTime" label="Starts" required />
                <TimeField name="endTime" label="Ends" required />
              </div>

              {/* Reading a night shift off two time fields is a mental
                  subtraction nobody should have to do, so the arithmetic
                  is stated outright. */}
              {complete ? (
                <dl className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg border border-hairline bg-surface-2 px-3.5 py-2.5">
                  <Metric label="Span" value={formatDuration(span)} />
                  <Metric label="Net" value={formatDuration(Math.max(span - breakMinutes, 0))} />
                  {isNightShift(startMinutes, endMinutes) ? (
                    <span className="font-mono text-[10px] tracking-[0.14em] text-awaiting uppercase">
                      Crosses midnight
                    </span>
                  ) : null}
                </dl>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  name="breakMinutes"
                  type="number"
                  label="Break (minutes)"
                  min={0}
                  required
                />
                <InputField
                  name="graceMinutes"
                  type="number"
                  label="Grace (minutes)"
                  min={0}
                  description="Lateness forgiven before a day counts as short."
                  required
                />
              </div>
            </Section>

            <Section title="Schedule">
              <SelectField
                multi
                name="weeklyOffDays"
                label="Weekly offs"
                placeholder="Pick the days off"
                options={WEEKDAY_OPTIONS}
                description="At most six, since a shift needs at least one working day."
              />

              <SwitchField
                name="isActive"
                label="Active"
                description="Inactive shifts stay on record but cannot be assigned to anyone new."
              />
            </Section>
          </>
        );
      }}
    </FormSheet>
  );
}

/** Eight fields in one column is a wall. The rules break it into the three
 *  questions the form is actually asking. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-mono text-[10px] tracking-[0.18em] text-text-low uppercase">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-hairline" />
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="font-mono text-[10px] tracking-[0.14em] text-text-low uppercase">{label}</dt>
      <dd data-numeric className="text-[13px] font-medium text-text-hi">
        {value}
      </dd>
    </div>
  );
}
