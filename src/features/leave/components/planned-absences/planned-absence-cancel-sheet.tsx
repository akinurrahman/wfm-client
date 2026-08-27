import { FormSheet, TextareaField } from '@/systems/form';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';

import { useCancelPlannedAbsence } from '../../api/planned-absence.mutations';
import { REASON_MAX } from '../../definitions/planned-absence.constants';
import {
  plannedAbsenceCancelSchema,
  toCancelPayload,
  type PlannedAbsenceCancelValues,
} from '../../definitions/planned-absence.schema';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absence: PlannedAbsence | null;
};

const defaultValues = { cancelReason: '' };

export function PlannedAbsenceCancelSheet({ open, onOpenChange, absence }: Props) {
  const cancelAbsence = useCancelPlannedAbsence();

  const windowLabel = absence
    ? `${formatDate(toCalendarDate(absence.startDate), 'dd MMM yyyy')} to ${formatDate(
        toCalendarDate(absence.endDate),
        'dd MMM yyyy'
      )}`
    : '';

  return (
    <FormSheet<PlannedAbsenceCancelValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={absence?.id ?? 'none'}
      title="Withdraw leave"
      description="The record is kept, not deleted: attendance rows point back at it. Days sitting on leave go back to absent, or to present where the punches say the person worked."
      schema={plannedAbsenceCancelSchema}
      defaultValues={defaultValues}
      submitLabel="Withdraw leave"
      pendingLabel="Withdrawing"
      isPending={cancelAbsence.isPending}
      onSubmit={values => {
        if (!absence) return;

        cancelAbsence.mutate(
          { id: absence.id, payload: toCancelPayload(values) },
          { onSuccess: () => onOpenChange(false) }
        );
      }}
    >
      {absence ? (
        <dl className="flex flex-wrap items-baseline gap-x-5 gap-y-1.5 rounded-lg border border-hairline bg-surface-2 px-3.5 py-2.5">
          <Fact label="Employee" value={absence.employee?.fullName ?? absence.employeeId} />
          <Fact label="Leave" value={absence.leaveType?.code ?? 'Leave'} />
          <Fact label="Window" value={windowLabel} />
        </dl>
      ) : null}

      <TextareaField
        name="cancelReason"
        label="Why it is being withdrawn"
        placeholder="Employee withdrew the request"
        maxLength={REASON_MAX}
        description="Kept on the record, so a reverted day can be explained later."
        required
      />
    </FormSheet>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="font-mono text-[10px] tracking-[0.14em] text-text-low uppercase">{label}</dt>
      <dd data-numeric className="text-[13px] font-medium text-text-hi">
        {value}
      </dd>
    </div>
  );
}
