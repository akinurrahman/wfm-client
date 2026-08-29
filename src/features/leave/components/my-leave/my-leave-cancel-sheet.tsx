import { FormSheet, TextareaField } from '@/systems/form';

import { useCancelMyLeave } from '../../api/my-leave.mutations';
import { REASON_MAX } from '../../definitions/planned-absence.constants';
import { plannedAbsenceStatusLookup } from '../../definitions/planned-absence.lookup';
import {
  plannedAbsenceCancelSchema,
  toCancelPayload,
  type PlannedAbsenceCancelValues,
} from '../../definitions/planned-absence.schema';
import type { PlannedAbsence } from '../../definitions/planned-absence.types';
import { AbsenceFacts } from '../absence-facts';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  absence: PlannedAbsence | null;
};

const defaultValues = { cancelReason: '' };

const PENDING_DESCRIPTION =
  'Nothing was approved yet, so no attendance day changes. The request closes and your admin sees it withdrawn.';

const APPROVED_DESCRIPTION =
  'This leave was already approved, so the days go back to how they stood: absent, or present where your punches say you worked.';

export function MyLeaveCancelSheet({ open, onOpenChange, absence }: Props) {
  const cancelMyLeave = useCancelMyLeave();

  const isPendingRequest = absence?.status === plannedAbsenceStatusLookup.keys.PENDING;

  return (
    <FormSheet<PlannedAbsenceCancelValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={absence?.id ?? 'none'}
      title="Withdraw request"
      description={isPendingRequest ? PENDING_DESCRIPTION : APPROVED_DESCRIPTION}
      schema={plannedAbsenceCancelSchema}
      defaultValues={defaultValues}
      submitLabel="Withdraw request"
      pendingLabel="Withdrawing"
      isPending={cancelMyLeave.isPending}
      onSubmit={values => {
        if (!absence) return;

        cancelMyLeave.mutate(
          { id: absence.id, payload: toCancelPayload(values) },
          { onSuccess: () => onOpenChange(false) }
        );
      }}
    >
      {absence ? <AbsenceFacts absence={absence} /> : null}

      <TextareaField
        name="cancelReason"
        label="Why you are withdrawing it"
        placeholder="Plans changed, no longer taking these days"
        maxLength={REASON_MAX}
        description="Stays on the request, so the change is explained later."
        required
      />
    </FormSheet>
  );
}
