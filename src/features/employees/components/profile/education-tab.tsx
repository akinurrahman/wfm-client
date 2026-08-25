import { useMemo, useState } from 'react';

import { GraduationCap } from 'lucide-react';
import type { DefaultValues } from 'react-hook-form';

import { DateField, FormSheet, InputField, SwitchField, TextareaField } from '@/systems/form';

import { useSaveEducations } from '../../api/employee-profile.mutations';
import {
  educationSchema,
  toEducationFormValues,
  toEducationUpsert,
  type EducationFormValues,
} from '../../definitions/employee-profile.schema';
import type { EducationRecord } from '../../definitions/employee-profile.types';
import { useCollectionDraft, type DraftRow } from '../../hooks/use-collection-draft';
import { CollectionEditor } from './collection-editor';
import { EducationSummary } from './education-summary';

type Props = {
  employeeId: string;
  records: EducationRecord[];
};

const ROW_DEFAULTS: DefaultValues<EducationFormValues> = {
  isCurrentlyStudying: false,
  endDate: '',
  passingYear: '',
  divisionGrade: '',
  marksObtained: '',
  remarks: '',
};

export function EducationTab({ employeeId, records }: Props) {
  const serverRows = useMemo(
    () => records.map(record => ({ id: record.id, values: toEducationFormValues(record) })),
    [records]
  );

  const draft = useCollectionDraft(serverRows);
  const saveEducations = useSaveEducations(employeeId);
  const [editing, setEditing] = useState<DraftRow<EducationFormValues> | 'new' | null>(null);

  const isEditingRow = editing !== null && editing !== 'new';

  return (
    <>
      <CollectionEditor
        title="Education"
        description="Qualifications on record. Added, edited and removed rows all save in one go."
        addLabel="Add qualification"
        emptyIcon={GraduationCap}
        emptyTitle="No qualifications recorded"
        emptyDescription="Add what the employee studied, and where."
        rows={draft.rows}
        rowSubject={values => values.courseName}
        renderRow={values => <EducationSummary values={values} />}
        onAdd={() => setEditing('new')}
        onEdit={row => setEditing(row)}
        onRemove={row => draft.remove(row.key)}
        deletedCount={draft.deleteIds.length}
        isDirty={draft.isDirty}
        isPending={saveEducations.isPending}
        onSave={() =>
          saveEducations.mutate(
            {
              upsert: draft.changedRows.map(row => toEducationUpsert(row.values, row.id)),
              deleteIds: draft.deleteIds,
            },
            { onSuccess: draft.commit }
          )
        }
        onDiscard={draft.reset}
      />

      <FormSheet<EducationFormValues>
        open={editing !== null}
        onOpenChange={open => setEditing(open ? editing : null)}
        formKey={isEditingRow ? editing.key : 'new'}
        title={isEditingRow ? 'Edit qualification' : 'Add qualification'}
        description="Saved into the list below. Nothing reaches the server until the tab is saved."
        schema={educationSchema}
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
            <InputField name="instituteName" label="Institute" required />
            <InputField name="courseName" label="Course" required />

            <div className="grid gap-4 sm:grid-cols-2">
              <DateField name="startDate" label="Started" placeholder="Pick a date" required />
              {form.watch('isCurrentlyStudying') ? null : (
                <DateField name="endDate" label="Ended" placeholder="Pick a date" />
              )}
            </div>

            <SwitchField name="isCurrentlyStudying" label="Still studying" />

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="passingYear" label="Passing year" placeholder="2024" maxLength={4} />
              <InputField name="divisionGrade" label="Division or grade" placeholder="First class" />
              <InputField name="marksObtained" label="Marks" placeholder="78%" />
            </div>

            <TextareaField name="remarks" label="Remarks" />
          </>
        )}
      </FormSheet>
    </>
  );
}

