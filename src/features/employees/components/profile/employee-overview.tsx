import { designationCategoryLookup } from '@/features/designations';
import { formatDate } from '@/lib/format';
import { LookupBadge } from '@/systems/ui/lookup-badge';
import { PanelSection } from '@/systems/ui/panel-section';

import { employeeTypeLookup, genderLookup } from '../../definitions/employee.lookup';
import type { EmployeeDetail } from '../../definitions/employee.types';
import { DetailList } from './detail-list';

type Props = {
  employee: EmployeeDetail;
};

const address = (line: string, city: string, state: string, pin: string, country: string) => (
  <span className="block">
    {line}
    <span className="block text-text-mid">
      {city}, {state} {pin}
    </span>
    <span className="block text-text-mid">{country}</span>
  </span>
);

export function EmployeeOverview({ employee }: Props) {
  return (
    <div className="space-y-4">
      <PanelSection title="Personal">
        <DetailList
          items={[
            { label: 'Full name', value: employee.fullName },
            { label: 'Date of birth', value: formatDate(employee.dateOfBirth, 'dd MMM yyyy') },
            {
              label: 'Gender',
              value: <LookupBadge lookup={genderLookup} value={employee.gender} />,
            },
            { label: 'Phone', value: employee.phoneNumber },
            { label: 'Alternate phone', value: employee.alternateNumber || null },
            { label: 'Email', value: employee.email },
          ]}
        />
      </PanelSection>

      <PanelSection title="Employment">
        <DetailList
          items={[
            { label: 'Badge code', value: employee.employeeId },
            { label: 'Designation', value: employee.designation.title },
            {
              label: 'Category',
              value: (
                <LookupBadge
                  lookup={designationCategoryLookup}
                  value={employee.designation.category}
                />
              ),
            },
            {
              label: 'Employee type',
              value: <LookupBadge lookup={employeeTypeLookup} value={employee.employeeType} />,
            },
            { label: 'Date of joining', value: formatDate(employee.dateOfJoining, 'dd MMM yyyy') },
            {
              label: 'Last working day',
              value: employee.lastWorkingDay
                ? formatDate(employee.lastWorkingDay, 'dd MMM yyyy')
                : null,
            },
          ]}
        />
      </PanelSection>

      <PanelSection title="Addresses">
        <DetailList
          items={[
            {
              label: 'Communication',
              value: address(
                employee.commAddressLine,
                employee.commCity,
                employee.commState,
                employee.commPin,
                employee.commCountry
              ),
            },
            {
              label: 'Permanent',
              value: address(
                employee.permAddressLine,
                employee.permCity,
                employee.permState,
                employee.permPin,
                employee.permCountry
              ),
            },
          ]}
        />
      </PanelSection>
    </div>
  );
}
