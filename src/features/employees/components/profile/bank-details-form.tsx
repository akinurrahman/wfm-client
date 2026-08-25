import type { DefaultValues } from 'react-hook-form';

import { Form, FormActions, InputField } from '@/systems/form';
import { PanelSection } from '@/systems/ui/panel-section';

import { useSaveBankDetails } from '../../api/employee-profile.mutations';
import { IFSC_LENGTH } from '../../definitions/employee-profile.constants';
import {
  bankDetailsSchema,
  type BankDetailsFormValues,
} from '../../definitions/employee-profile.schema';
import type { BankDetails } from '../../definitions/employee-profile.types';

type Props = {
  employeeId: string;
  bankDetails: BankDetails | null;
};

export function BankDetailsForm({ employeeId, bankDetails }: Props) {
  const saveBankDetails = useSaveBankDetails(employeeId);

  const defaultValues: DefaultValues<BankDetailsFormValues> = bankDetails
    ? {
        accountNo: bankDetails.accountNo,
        ifscCode: bankDetails.ifscCode,
        bankName: bankDetails.bankName,
        branchName: bankDetails.branchName,
        accountHolder: bankDetails.accountHolder,
      }
    : {};

  return (
    <Form<BankDetailsFormValues>
      key={bankDetails?.id ?? 'blank'}
      schema={bankDetailsSchema}
      defaultValues={defaultValues}
      onSubmit={values => saveBankDetails.mutate(values)}
      className="space-y-4"
    >
      {form => (
        <>
          <PanelSection
            title="Bank details"
            description="Where salary lands. The account holder is the name on the bank record, which is not always the employee's."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="accountHolder" label="Account holder" required />
              <InputField name="accountNo" label="Account number" required />
              <InputField
                name="ifscCode"
                label="IFSC code"
                placeholder="HDFC0001234"
                maxLength={IFSC_LENGTH}
                description="Uppercased on save."
                required
              />
              <InputField name="bankName" label="Bank" required />
              <InputField name="branchName" label="Branch" required />
            </div>
          </PanelSection>

          <FormActions
            submitLabel="Save bank details"
            isPending={saveBankDetails.isPending}
            cancelLabel="Reset"
            onCancel={() => form.reset()}
            className="rounded-lg border border-hairline"
          />
        </>
      )}
    </Form>
  );
}
