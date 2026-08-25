import { Button } from '@/components/ui/button';
import { useDesignationOptions } from '@/features/designations';
import { useShiftOptions } from '@/features/shifts';
import { toCalendarDate } from '@/lib/time';
import { DateField, Form, FormActions, InputField, SelectField } from '@/systems/form';
import { PanelSection } from '@/systems/ui/panel-section';

import { useCreateEmployee, useUpdateEmployee } from '../../api/employee.mutations';
import { ADDRESS_LINE_MAX, FULL_NAME_MAX } from '../../definitions/employee.constants';
import { employeeTypeLookup, genderLookup } from '../../definitions/employee.lookup';
import {
  employeeFormSchema,
  toEmployeeCreatePayload,
  toEmployeeUpdatePayload,
  type EmployeeFormValues,
} from '../../definitions/employee.schema';
import type { EmployeeDetail } from '../../definitions/employee.types';

type Props = {
  initialData?: EmployeeDetail;
  /** Carries the saved record, since a create has nowhere else to learn the new
   *  employee's id and the profile sections all hang off it. */
  onSuccess?: (employee: EmployeeDetail) => void;
  onCancel?: () => void;
};

const CREATE_DEFAULTS: Partial<EmployeeFormValues> = {
  commCountry: 'India',
  permCountry: 'India',
};

const ADDRESS_FIELDS = ['AddressLine', 'City', 'State', 'Pin', 'Country'] as const;

const toFormValues = (employee: EmployeeDetail): EmployeeFormValues => ({
  email: employee.email,
  fullName: employee.fullName,
  phoneNumber: employee.phoneNumber,
  alternateNumber: employee.alternateNumber ?? '',
  dateOfBirth: toCalendarDate(employee.dateOfBirth),
  gender: employee.gender,
  employeeType: employee.employeeType,
  designationId: employee.designationId,
  dateOfJoining: toCalendarDate(employee.dateOfJoining),
  shiftId: employee.shiftId ?? '',
  commAddressLine: employee.commAddressLine,
  commCity: employee.commCity,
  commState: employee.commState,
  commPin: employee.commPin,
  commCountry: employee.commCountry,
  permAddressLine: employee.permAddressLine,
  permCity: employee.permCity,
  permState: employee.permState,
  permPin: employee.permPin,
  permCountry: employee.permCountry,
});

export function EmployeeForm({ initialData, onSuccess, onCancel }: Props) {
  const isEdit = Boolean(initialData);
  const editValues = initialData ? toFormValues(initialData) : undefined;

  const { data: designationOptions = [], isLoading: designationsLoading } =
    useDesignationOptions();
  const { data: shiftOptions = [], isLoading: shiftsLoading } = useShiftOptions();

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee(initialData?.id ?? '');
  const mutation = isEdit ? updateEmployee : createEmployee;

  return (
    <Form<EmployeeFormValues>
      key={initialData?.id ?? 'new'}
      schema={employeeFormSchema}
      defaultValues={editValues ?? CREATE_DEFAULTS}
      onSubmit={values =>
        editValues
          ? updateEmployee.mutate(toEmployeeUpdatePayload(values, editValues), {
              onSuccess: response => onSuccess?.(response.data),
            })
          : createEmployee.mutate(toEmployeeCreatePayload(values), {
              onSuccess: response => onSuccess?.(response.data),
            })
      }
      className="space-y-4"
    >
      {form => (
        <>
          <PanelSection
            title="Account"
            description={
              isEdit
                ? 'The login address is fixed once the account exists.'
                : 'Creating an employee creates their login. The temporary password is handed over out of band.'
            }
          >
            <InputField
              name="email"
              type="email"
              label="Email"
              placeholder="asha@acme.com"
              disabled={isEdit}
              autoComplete="off"
              required
            />
          </PanelSection>

          <PanelSection title="Personal">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                name="fullName"
                label="Full name"
                placeholder="Asha Verma"
                maxLength={FULL_NAME_MAX}
                required
              />
              <DateField name="dateOfBirth" label="Date of birth" placeholder="Pick a date" required />
              <InputField
                name="phoneNumber"
                type="tel"
                label="Phone number"
                placeholder="9876543210"
                required
              />
              <InputField
                name="alternateNumber"
                type="tel"
                label="Alternate number"
                placeholder="Optional"
              />
              <SelectField
                name="gender"
                label="Gender"
                placeholder="Pick one"
                options={genderLookup.options}
                required
              />
              <SelectField
                name="employeeType"
                label="Employee type"
                placeholder="Pick a skill grade"
                options={employeeTypeLookup.options}
                required
              />
            </div>
          </PanelSection>

          <PanelSection title="Employment">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="designationId"
                label="Designation"
                placeholder={designationsLoading ? 'Loading' : 'Pick a designation'}
                options={designationOptions}
                disabled={designationsLoading}
                required
              />
              <SelectField
                name="shiftId"
                label="Shift"
                placeholder={shiftsLoading ? 'Loading' : 'Pick a shift'}
                options={shiftOptions}
                disabled={shiftsLoading}
                description="Attendance is judged against this. Punches from an unassigned employee are ignored."
                required
              />
              <DateField
                name="dateOfJoining"
                label="Date of joining"
                placeholder="Pick a date"
                required
              />
            </div>
          </PanelSection>

          <PanelSection title="Communication address">
            <InputField
              name="commAddressLine"
              label="Address"
              placeholder="Flat, street, landmark"
              maxLength={ADDRESS_LINE_MAX}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="commCity" label="City" required />
              <InputField name="commState" label="State" required />
              <InputField name="commPin" label="PIN code" placeholder="560001" required />
              <InputField name="commCountry" label="Country" required />
            </div>
          </PanelSection>

          <PanelSection
            title="Permanent address"
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  ADDRESS_FIELDS.forEach(field =>
                    form.setValue(`perm${field}`, form.getValues(`comm${field}`) ?? '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  )
                }
              >
                Same as communication
              </Button>
            }
          >
            <InputField
              name="permAddressLine"
              label="Address"
              placeholder="Flat, street, landmark"
              maxLength={ADDRESS_LINE_MAX}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField name="permCity" label="City" required />
              <InputField name="permState" label="State" required />
              <InputField name="permPin" label="PIN code" placeholder="560001" required />
              <InputField name="permCountry" label="Country" required />
            </div>
          </PanelSection>

          <FormActions
            submitLabel={isEdit ? 'Save changes' : 'Create employee'}
            isPending={mutation.isPending}
            onCancel={() => onCancel?.()}
            className="rounded-lg border border-hairline"
          />
        </>
      )}
    </Form>
  );
}

