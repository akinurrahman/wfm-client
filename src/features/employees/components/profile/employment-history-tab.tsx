import { useMemo, useState } from 'react';

import { Building2 } from 'lucide-react';
import type { DefaultValues } from 'react-hook-form';

import {
  DateField,
  FormSheet,
  InputField,
  SelectField,
  SwitchField,
  TextareaField,
} from '@/systems/form';

import { useSaveEmploymentHistories } from '../../api/employee-profile.mutations';
import { salaryPeriodLookup } from '../../definitions/employee-profile.lookup';
import {
  employmentHistorySchema,
  toEmploymentHistoryFormValues,
  toEmploymentHistoryUpsert,
  type EmploymentHistoryFormValues,
} from '../../definitions/employee-profile.schema';
import type { EmploymentHistory } from '../../definitions/employee-profile.types';
import { useCollectionDraft, type DraftRow } from '../../hooks/use-collection-draft';
import { CollectionEditor } from './collection-editor';
import { EmploymentSummary } from './employment-summary';

type Props = {
  employeeId: string;
  records: EmploymentHistory[];
};

const ROW_DEFAULTS: DefaultValues<EmploymentHistoryFormValues> = {
  isCurrentlyWorking: false,
  endDate: '',
  jobResponsibilities: '',
  salary: '',
  salaryPeriod: '',
};

export function EmploymentHistoryTab({ employeeId, records }: Props) {
  const serverRows = useMemo(
    () =>
      records.map(record => ({ id: record.id, values: toEmploymentHistoryFormValues(record) })),
    [records]
  );

  const draft = useCollectionDraft(serverRows);
  const saveHistories = useSaveEmploymentHistories(employeeId);
  const [editing, setEditing] = useState<DraftRow<EmploymentHistoryFormValues> | 'new' | null>(
    null
  );

  const isEditingRow = editing !== null && editing !== 'new';

  return (
    <>
      <CollectionEditor
        title="Employment history"
        description="Where this employee worked before joining."
        addLabel="Add role"
        emptyIcon={Building2}
        emptyTitle="No previous roles recorded"
        emptyDescription="Add the jobs held before this one."
        rows={draft.rows}
        rowSubject={values => `${values.designation} at ${values.orgName}`}
        renderRow={values => <EmploymentSummary values={values} />}
        onAdd={() => setEditing('new')}
        onEdit={row => setEditing(row)}
        onRemove={row => draft.remove(row.key)}
        deletedCount={draft.deleteIds.length}
        isDirty={draft.isDirty}
        isPending={saveHistories.isPending}
        onSave={() =>
          saveHistories.mutate(
            {
              upsert: draft.changedRows.map(row => toEmploymentHistoryUpsert(row.values, row.id)),
              deleteIds: draft.deleteIds,
            },
            { onSuccess: draft.commit }
          )
        }
        onDiscard={draft.reset}
      />

      <FormSheet<EmploymentHistoryFormValues>
        open={editing !== null}
        onOpenChange={open => setEditing(open ? editing : null)}
        formKey={isEditingRow ? editing.key : 'new'}
        title={isEditingRow ? 'Edit role' : 'Add role'}
        description="Saved into the list below. Nothing reaches the server until the tab is saved."
        schema={employmentHistorySchema}
        defaultValues={isEditingRow ? editing.values : ROW_DEFAULTS}
        submitLabel={isEditingRow ? 'Update row' : 'Add to list'}
        className="sm:max-w-xl"
        // The write is local, so the sheet closes on submit rather than waiting
        // on a request that is not made here.
        onSubmit={values => {
          if (isEditingRow) draft.update(editing.key, values);
          else draft.add(values);
          setEditing(null);
        }}
      >
        {form => (
          <>
            <InputField name="orgName" label="Organisation" required />
            <InputField name="designation" label="Designation" required />

            <div className="grid gap-4 sm:grid-cols-2">
              <DateField name="startDate" label="Started" placeholder="Pick a date" required />
              {form.watch('isCurrentlyWorking') ? null : (
                <DateField name="endDate" label="Ended" placeholder="Pick a date" />
              )}
            </div>

            <SwitchField name="isCurrentlyWorking" label="Still working there" />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="salary" label="Salary" placeholder="45000" />
              <SelectField
                name="salaryPeriod"
                label="Paid"
                placeholder="Pick a period"
                options={salaryPeriodLookup.options}
              />
            </div>

            <TextareaField name="jobResponsibilities" label="Responsibilities" />
          </>
        )}
      </FormSheet>
    </>
  );
}

