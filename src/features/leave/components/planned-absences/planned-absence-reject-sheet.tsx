import { FormSheet, TextareaField } from '@/systems/form';

import { useRejectPlannedAbsence } from '../../api/planned-absence.mutations';
import { REASON_MAX } from '../../definitions/planned-absence.constants';
import {
  plannedAbsenceRejectSchema,
  toRejectPayload,
  type PlannedAbsenceRejectValues,
} from '../../definitions/planned-absence.schema';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';
import { AbsenceFacts } from '../absence-facts';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absence: PlannedAbsence | null;
};

const defaultValues = { rejectReason: '' };

export function PlannedAbsenceRejectSheet({ open, onOpenChange, absence }: Props) {
  const rejectAbsence = useRejectPlannedAbsence();

  return (
    <FormSheet<PlannedAbsenceRejectValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={absence?.id ?? 'none'}
      title="Reject leave request"
      description="Rejecting is final: the request authorised nothing, so there is nothing to undo and it cannot be withdrawn afterwards. The employee reads the reason on their own screen."
      schema={plannedAbsenceRejectSchema}
      defaultValues={defaultValues}
      submitLabel="Reject request"
      pendingLabel="Rejecting"
      isPending={rejectAbsence.isPending}
      onSubmit={values => {
        if (!absence) return;

        rejectAbsence.mutate(
          { id: absence.id, payload: toRejectPayload(values) },
          { onSuccess: () => onOpenChange(false) }
        );
      }}
    >
      {absence ? <AbsenceFacts absence={absence} /> : null}

      <TextareaField
        name="rejectReason"
        label="Why it is being turned down"
        placeholder="Two people already off that week"
        maxLength={REASON_MAX}
        description="Shown to the employee, so write it for them to read."
        required
      />
    </FormSheet>
  );
}
