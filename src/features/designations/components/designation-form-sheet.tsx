import type { DefaultValues } from 'react-hook-form';

import { FormSheet, InputField, SelectField } from '@/systems/form';

import { useCreateDesignation, useUpdateDesignation } from '../api/designation.mutations';
import { DESIGNATION_TITLE_MAX } from '../definitions/designation.constants';
import { designationCategoryLookup } from '../definitions/designation.lookup';
import {
  designationFormSchema,
  type DesignationFormValues,
} from '../definitions/designation.schema';
import type { Designation } from '../definitions/designation.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Absent means create. Present means edit that row. */
  designation?: Designation;
};

export function DesignationFormSheet({ open, onOpenChange, designation }: Props) {
  const isEdit = Boolean(designation);

  const createDesignation = useCreateDesignation();
  const updateDesignation = useUpdateDesignation(designation?.id ?? '');
  const mutation = isEdit ? updateDesignation : createDesignation;

  const defaultValues: DefaultValues<DesignationFormValues> = designation
    ? { title: designation.title, category: designation.category }
    : {};

  return (
    <FormSheet<DesignationFormValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={designation?.id ?? 'new'}
      title={isEdit ? 'Edit designation' : 'New designation'}
      description={
        isEdit
          ? 'Renaming a designation updates it everywhere it is already assigned.'
          : 'Employees are hired into a designation, so this has to exist before they do.'
      }
      schema={designationFormSchema}
      defaultValues={defaultValues}
      submitLabel={isEdit ? 'Save changes' : 'Create designation'}
      isPending={mutation.isPending}
      onSubmit={values => mutation.mutate(values, { onSuccess: () => onOpenChange(false) })}
    >
      <InputField
        name="title"
        label="Title"
        placeholder="Shift Supervisor"
        maxLength={DESIGNATION_TITLE_MAX}
        required
      />
      <SelectField
        name="category"
        label="Category"
        placeholder="Pick a category"
        options={designationCategoryLookup.options}
        description="Groups designations for reporting. It does not affect access."
        required
      />
    </FormSheet>
  );
}
