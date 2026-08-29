import type { DefaultValues } from 'react-hook-form';

import { DateField, FormSheet, SelectField, SwitchField, TextareaField } from '@/systems/form';

import { useLeaveTypeOptions } from '../../api/leave-type.queries';
import { useApplyForLeave } from '../../api/my-leave.mutations';
import {
  myLeaveApplySchema,
  toMyLeaveApplyPayload,
  type MyLeaveApplyValues,
} from '../../definitions/my-leave.schema';
import { REASON_MAX } from '../../definitions/planned-absence.constants';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const defaultValues: DefaultValues<MyLeaveApplyValues> = {
  leaveTypeId: '',
  startDate: '',
  endDate: '',
  isHalfDay: false,
  reason: '',
};

export function MyLeaveApplySheet({ open, onOpenChange }: Props) {
  const applyForLeave = useApplyForLeave();
  const { data: leaveTypeOptions = [], isLoading: leaveTypesLoading } = useLeaveTypeOptions();

  return (
    <FormSheet<MyLeaveApplyValues>
      open={open}
      onOpenChange={onOpenChange}
      title="Request leave"
      description="The request waits for your admin. Until they approve it your attendance is unchanged, so the days stay as they are."
      schema={myLeaveApplySchema}
      defaultValues={defaultValues}
      submitLabel="Send request"
      pendingLabel="Sending"
      isPending={applyForLeave.isPending}
      onSubmit={values =>
        applyForLeave.mutate(toMyLeaveApplyPayload(values), {
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
                description="Only a single-day request can be half a day."
              />
            ) : null}

            <TextareaField
              name="reason"
              label="Reason"
              placeholder="Family function"
              maxLength={REASON_MAX}
              description="Your admin reads this when they decide."
              required
            />
          </>
        );
      }}
    </FormSheet>
  );
}
