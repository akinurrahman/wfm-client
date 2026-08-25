import { useNavigate } from 'react-router';

import { PageHeader } from '@/components/shared/page-header';

import { EmployeeForm } from '../../components/employees/employee-form';

/** Only the core record. Family, IDs, bank and the collections all hang off an
 *  employee id, so they open once the record exists. */
export default function EmployeeCreatePage() {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      <PageHeader
        title="New employee"
        description="Creates the employee record and the login that goes with it."
      />

      {/* Straight on into the profile sections, which only become reachable
          once the record has an id. Family rather than details: the details
          were just filled in, and reopening them reads as a failed save. */}
      <EmployeeForm
        onSuccess={employee => navigate(`/employees/${employee.id}/edit?tab=family`)}
        onCancel={() => navigate('/employees')}
      />
    </div>
  );
}
