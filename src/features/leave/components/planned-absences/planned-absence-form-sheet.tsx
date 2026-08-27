import type { DefaultValues } from 'react-hook-form';

import { fetchEmployeeOptions } from '@/features/employees';
import { AsyncSelectField, DateField, FormSheet, SelectField, SwitchField, TextareaField } from '@/systems/form';

import { useCreatePlannedAbsence } from '../../api/planned-absence.mutations';
import { useLeaveTypeOptions } from '../../api/leave-type.queries';
import { REASON_MAX } from '../../definitions/planned-absence.constants';
import {
  plannedAbsenceFormSchema,
  toPlannedAbsencePayload,
  type PlannedAbsenceFormValues,
} from '../../definitions/planned-absence.schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: DefaultValues<PlannedAbsenceFormValues> = {
  employeeId: '',
  leaveTypeId: '',
  startDate: '',
  endDate: '',
  isHalfDay: false,
  reason: '',
};

export function PlannedAbsenceFormSheet({ open, onOpenChange }: Props) {
  const createAbsence = useCreatePlannedAbsence();
  const { data: leaveTypeOptions = [], isLoading: leaveTypesLoading } = useLeaveTypeOptions();

  return (
    <FormSheet<PlannedAbsenceFormValues>
      open={open}
      onOpenChange={onOpenChange}
      title="File leave"
      description="Filing leave also rewrites days that are already closed. Days marked absent flip to on leave; days a punch or a manual mark contradicts are left alone and reported back."
      schema={plannedAbsenceFormSchema}
      defaultValues={defaultValues}
      submitLabel="File leave"
      pendingLabel="Filing"
      isPending={createAbsence.isPending}
      onSubmit={values =>
        createAbsence.mutate(toPlannedAbsencePayload(values), {
          onSuccess: () => onOpenChange(false),
        })
      }
      className="sm:max-w-xl"
    >
      {form => {
        const startDate = form.watch('startDate');
        const endDate = form.watch('endDate');
        const isSingleDay = Boolean(startDate) && startDate === endDate;

        return (
          <>
            <AsyncSelectField
              name="employeeId"
              label="Employee"
              placeholder="Search by name or badge code"
              fetchOptions={fetchEmployeeOptions}
              required
            />

            <SelectField
              name="leaveTypeId"
              label="Leave type"
              placeholder={leaveTypesLoading ? 'Loading leave types' : 'Pick a leave type'}
              options={leaveTypeOptions}
              disabled={leaveTypesLoading}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                name="startDate"
                label="First day"
                description="Both bounds count."
                required
              />
              <DateField name="endDate" label="Last day" minDate={startDate || undefined} required />
            </div>

            {isSingleDay ? (
              <SwitchField
                name="isHalfDay"
                label="Half day"
                description="Only a single-day absence can be half a day. The API rejects the flag on a range."
              />
            ) : null}

            <TextareaField
              name="reason"
              label="Reason"
              placeholder="Family function"
              maxLength={REASON_MAX}
              description="Recorded against the absence and read back on the roster."
              required
            />
          </>
        );
      }}
    </FormSheet>
  );
}
