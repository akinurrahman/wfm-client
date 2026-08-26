import { FormSheet, TextareaField } from '@/systems/form';

import { useUnlockPeriod } from '../../api/attendance-period.mutations';
import { UNLOCK_REASON_MAX } from '../../definitions/attendance-period.constants';
import {
  periodUnlockSchema,
  type PeriodUnlockValues,
} from '../../definitions/attendance-period.schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodId: string | null;
  cycleLabel: string;
};

/** An escape hatch, not a routine correction: re-locking does not overwrite the
 *  snapshot payroll already read, it inserts a new version beside it. The
 *  mandatory reason is the only restraint the API has, so the copy says why. */
export function PeriodUnlockSheet({ open, onOpenChange, periodId, cycleLabel }: Props) {
  const unlockPeriod = useUnlockPeriod();

  return (
    <FormSheet<PeriodUnlockValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={periodId ?? 'none'}
      title={`Unlock ${cycleLabel}`}
      description="Attendance for this cycle becomes writable again and re-locking creates a new summary version. The reason is recorded against your account."
      schema={periodUnlockSchema}
      defaultValues={{ unlockReason: '' }}
      submitLabel="Unlock period"
      pendingLabel="Unlocking"
      isPending={unlockPeriod.isPending}
      onSubmit={values => {
        if (!periodId) return;
        unlockPeriod.mutate(
          { id: periodId, payload: values },
          { onSuccess: () => onOpenChange(false) }
        );
      }}
    >
      <TextareaField
        name="unlockReason"
        label="Reason"
        placeholder="Late punch data received from the east gate device for 12 Aug"
        maxLength={UNLOCK_REASON_MAX}
        description="At least 10 characters. Name what arrived late or what was wrong, not that it was wrong."
        required
      />
    </FormSheet>
  );
}
