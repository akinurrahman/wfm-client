import type { DefaultValues } from 'react-hook-form';

import { Form, FormActions, InputField, SelectField, TextareaField } from '@/systems/form';
import { PanelSection } from '@/systems/ui/panel-section';

import { useSaveFamilyInfo } from '../../api/employee-profile.mutations';
import {
  emergencyContactRelationLookup,
  maritalStatusLookup,
} from '../../definitions/employee-profile.lookup';
import {
  familyInfoSchema,
  toFamilyInfoPayload,
  type FamilyInfoFormValues,
} from '../../definitions/employee-profile.schema';
import type { FamilyInfo } from '../../definitions/employee-profile.types';

type Props = {
  employeeId: string;
  familyInfo: FamilyInfo | null;
};

export function FamilyInfoForm({ employeeId, familyInfo }: Props) {
  const saveFamilyInfo = useSaveFamilyInfo(employeeId);

  const defaultValues: DefaultValues<FamilyInfoFormValues> = familyInfo
    ? {
        fathersName: familyInfo.fathersName,
        mothersName: familyInfo.mothersName,
        maritalStatus: familyInfo.maritalStatus,
        spouseName: familyInfo.spouseName ?? '',
        emergencyContactName: familyInfo.emergencyContactName,
        emergencyContactNumber: familyInfo.emergencyContactNumber,
        emergencyContactRelation: familyInfo.emergencyContactRelation,
        emergencyContactAddress: familyInfo.emergencyContactAddress,
      }
    : {};

  return (
    <Form<FamilyInfoFormValues>
      // The record arrives with the profile, so the form has to re-seed once it
      // lands rather than staying on the empty defaults it mounted with.
      key={familyInfo?.id ?? 'blank'}
      schema={familyInfoSchema}
      defaultValues={defaultValues}
      onSubmit={values => saveFamilyInfo.mutate(toFamilyInfoPayload(values))}
      className="space-y-4"
    >
      {form => (
        <>
          <PanelSection
            title="Family"
            description="A full replace: whatever is here is what the record becomes."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="fathersName" label="Father's name" required />
              <InputField name="mothersName" label="Mother's name" required />
              <SelectField
                name="maritalStatus"
                label="Marital status"
                placeholder="Pick one"
                options={maritalStatusLookup.options}
                required
              />
              {form.watch('maritalStatus') === maritalStatusLookup.keys.MARRIED ? (
                <InputField name="spouseName" label="Spouse name" required />
              ) : null}
            </div>
          </PanelSection>

          <PanelSection
            title="Emergency contact"
            description="Who gets called first when something happens on site."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="emergencyContactName" label="Name" required />
              <InputField
                name="emergencyContactNumber"
                type="tel"
                label="Phone number"
                placeholder="9876543210"
                required
              />
              <SelectField
                name="emergencyContactRelation"
                label="Relation"
                placeholder="Pick a relation"
                options={emergencyContactRelationLookup.options}
                required
              />
            </div>
            <TextareaField name="emergencyContactAddress" label="Address" />
          </PanelSection>

          <FormActions
            submitLabel="Save family details"
            isPending={saveFamilyInfo.isPending}
            cancelLabel="Reset"
            onCancel={() => form.reset()}
            className="rounded-lg border border-hairline"
          />
        </>
      )}
    </Form>
  );
}
