import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { DefaultValues } from 'react-hook-form';

import { Form, FormActions, InputField, SelectField } from '@/systems/form';

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-hairline p-5">
          <SheetTitle className="font-serif text-lg text-text-hi">
            {isEdit ? 'Edit designation' : 'New designation'}
          </SheetTitle>
          <SheetDescription className="text-[13px] text-text-mid">
            {isEdit
              ? 'Renaming a designation updates it everywhere it is already assigned.'
              : 'Employees are hired into a designation, so this has to exist before they do.'}
          </SheetDescription>
        </SheetHeader>

        <Form<DesignationFormValues>
          // Reopening on a different row has to start from that row's values,
          // not the ones the last edit left behind.
          key={designation?.id ?? 'new'}
          schema={designationFormSchema}
          defaultValues={defaultValues}
          onSubmit={values => mutation.mutate(values, { onSuccess: () => onOpenChange(false) })}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
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
          </div>

          <FormActions
            submitLabel={isEdit ? 'Save changes' : 'Create designation'}
            isPending={mutation.isPending}
            onCancel={() => onOpenChange(false)}
          />
        </Form>
      </SheetContent>
    </Sheet>
  );
}
