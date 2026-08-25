import { useMemo, useState } from 'react';

import { Award } from 'lucide-react';
import type { DefaultValues } from 'react-hook-form';

import { DateField, FormSheet, InputField, TextareaField } from '@/systems/form';

import { useSaveCertificates } from '../../api/employee-profile.mutations';
import {
  certificateSchema,
  toCertificateFormValues,
  toCertificateUpsert,
  type CertificateFormValues,
} from '../../definitions/employee-profile.schema';
import type { Certificate } from '../../definitions/employee-profile.types';
import { useCollectionDraft, type DraftRow } from '../../hooks/use-collection-draft';
import { CertificateSummary } from './certificate-summary';
import { CollectionEditor } from './collection-editor';

type Props = {
  employeeId: string;
  records: Certificate[];
};

const ROW_DEFAULTS: DefaultValues<CertificateFormValues> = {
  topicDescription: '',
  certificateUrl: '',
  issueDate: '',
  expiryDate: '',
};

export function CertificatesTab({ employeeId, records }: Props) {
  const serverRows = useMemo(
    () => records.map(record => ({ id: record.id, values: toCertificateFormValues(record) })),
    [records]
  );

  const draft = useCollectionDraft(serverRows);
  const saveCertificates = useSaveCertificates(employeeId);
  const [editing, setEditing] = useState<DraftRow<CertificateFormValues> | 'new' | null>(null);

  const isEditingRow = editing !== null && editing !== 'new';

  return (
    <>
      <CollectionEditor
        title="Certificates"
        description="Training and licences. A link is stored as text, since there is no upload service yet."
        addLabel="Add certificate"
        emptyIcon={Award}
        emptyTitle="No certificates recorded"
        emptyDescription="Add the training or licences this employee holds."
        rows={draft.rows}
        rowSubject={values => values.certificateName}
        renderRow={values => <CertificateSummary values={values} />}
        onAdd={() => setEditing('new')}
        onEdit={row => setEditing(row)}
        onRemove={row => draft.remove(row.key)}
        deletedCount={draft.deleteIds.length}
        isDirty={draft.isDirty}
        isPending={saveCertificates.isPending}
        onSave={() =>
          saveCertificates.mutate(
            {
              upsert: draft.changedRows.map(row => toCertificateUpsert(row.values, row.id)),
              deleteIds: draft.deleteIds,
            },
            { onSuccess: draft.commit }
          )
        }
        onDiscard={draft.reset}
      />

      <FormSheet<CertificateFormValues>
        open={editing !== null}
        onOpenChange={open => setEditing(open ? editing : null)}
        formKey={isEditingRow ? editing.key : 'new'}
        title={isEditingRow ? 'Edit certificate' : 'Add certificate'}
        description="Saved into the list below. Nothing reaches the server until the tab is saved."
        schema={certificateSchema}
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
        <InputField name="certificateName" label="Certificate" required />
        <InputField name="issuingOrg" label="Issued by" required />

        <div className="grid gap-4 sm:grid-cols-2">
          <DateField name="issueDate" label="Issued on" placeholder="Pick a date" />
          <DateField name="expiryDate" label="Expires on" placeholder="Pick a date" />
        </div>

        <InputField
          name="certificateUrl"
          type="url"
          label="Link"
          placeholder="https://"
          description="Stored as plain text. There is no file upload behind this yet."
        />
        <TextareaField name="topicDescription" label="What it covers" />
      </FormSheet>
    </>
  );
}

