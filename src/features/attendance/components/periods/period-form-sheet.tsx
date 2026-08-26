import { useMemo } from 'react';

import type { DefaultValues } from 'react-hook-form';

import { DateField, FormSheet, SelectField, SwitchField } from '@/systems/form';

import { useCreatePeriod } from '../../api/attendance-period.mutations';
import {
  MONTH_OPTIONS,
  monthlyYearOptions,
} from '../../definitions/attendance-monthly.constants';
import {
  periodFormSchema,
  toPeriodPayload,
  type PeriodFormValues,
} from '../../definitions/attendance-period.schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The label the sheet opens on, so declaring from the monthly sheet lands on
   *  the cycle being looked at rather than on today. */
  year: number;
  month: number;
};

export function PeriodFormSheet({ open, onOpenChange, year, month }: Props) {
  const createPeriod = useCreatePeriod();
  const yearOptions = useMemo(() => monthlyYearOptions(), []);

  const defaultValues: DefaultValues<PeriodFormValues> = {
    year: String(year),
    month: String(month),
    hasCustomWindow: false,
  };

  return (
    <FormSheet<PeriodFormValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={`${year}-${month}`}
      title="Declare a period"
      description="A period is born open, and only lock and unlock ever move it. There is no edit and no delete: moving the boundaries once rows exist would silently re-scope what is locked."
      schema={periodFormSchema}
      defaultValues={defaultValues}
      submitLabel="Declare period"
      isPending={createPeriod.isPending}
      onSubmit={values =>
        createPeriod.mutate(toPeriodPayload(values), { onSuccess: () => onOpenChange(false) })
      }
    >
      {form => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField name="month" label="Month" options={MONTH_OPTIONS} required />
            <SelectField name="year" label="Year" options={yearOptions} required />
          </div>

          <SwitchField
            name="hasCustomWindow"
            label="Custom cycle window"
            description="Leave this off for the calendar month. Turn it on for a payroll cycle that runs across two of them, such as the 26th to the 25th."
          />

          {form.watch('hasCustomWindow') ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField name="startDate" label="Starts" required />
              <DateField name="endDate" label="Ends" required />
            </div>
          ) : null}
        </>
      )}
    </FormSheet>
  );
}
