import type { DefaultValues } from 'react-hook-form';

import { Form, FormActions, InputField } from '@/systems/form';
import { PanelSection } from '@/systems/ui/panel-section';

import { useSaveGovtIds } from '../../api/employee-profile.mutations';
import { AADHAR_LENGTH, PAN_LENGTH } from '../../definitions/employee-profile.constants';
import {
  govtIdsSchema,
  toGovtIdsPayload,
  type GovtIdsFormValues,
} from '../../definitions/employee-profile.schema';
import type { GovtIds } from '../../definitions/employee-profile.types';

type Props = {
  employeeId: string;
  govtIds: GovtIds | null;
};

export function GovtIdsForm({ employeeId, govtIds }: Props) {
  const saveGovtIds = useSaveGovtIds(employeeId);

  const defaultValues: DefaultValues<GovtIdsFormValues> = govtIds
    ? {
        aadharNo: govtIds.aadharNo,
        panNo: govtIds.panNo,
        uanNo: govtIds.uanNo ?? '',
        esicNo: govtIds.esicNo ?? '',
      }
    : {};

  return (
    <Form<GovtIdsFormValues>
      key={govtIds?.id ?? 'blank'}
      schema={govtIdsSchema}
      defaultValues={defaultValues}
      onSubmit={values => saveGovtIds.mutate(toGovtIdsPayload(values))}
      className="space-y-4"
    >
      {form => (
        <>
          <PanelSection
            title="Government IDs"
            description="Each number is unique across the company, so a duplicate is rejected on save."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                name="aadharNo"
                label="Aadhaar number"
                placeholder="123456789012"
                maxLength={AADHAR_LENGTH}
                required
              />
              <InputField
                name="panNo"
                label="PAN"
                placeholder="ABCDE1234F"
                maxLength={PAN_LENGTH}
                description="Uppercased on save."
                required
              />
              <InputField name="uanNo" label="UAN" placeholder="Optional" maxLength={12} />
              <InputField name="esicNo" label="ESIC number" placeholder="Optional" maxLength={17} />
            </div>
          </PanelSection>

          <FormActions
            submitLabel="Save government IDs"
            isPending={saveGovtIds.isPending}
            cancelLabel="Reset"
            onCancel={() => form.reset()}
            className="rounded-lg border border-hairline"
          />
        </>
      )}
    </Form>
  );
}
