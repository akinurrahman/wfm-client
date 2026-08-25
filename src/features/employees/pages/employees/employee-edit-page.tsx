import { Eye, UserX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUrlFilters } from '@/systems/filters';

import { useEmployee } from '../../api/employee.queries';
import { EmployeeForm } from '../../components/employees/employee-form';
import { BankDetailsForm } from '../../components/profile/bank-details-form';
import { CertificatesTab } from '../../components/profile/certificates-tab';
import { EducationTab } from '../../components/profile/education-tab';
import { EmploymentHistoryTab } from '../../components/profile/employment-history-tab';
import { FamilyInfoForm } from '../../components/profile/family-info-form';
import { GovtIdsForm } from '../../components/profile/govt-ids-form';
import { EDIT_TABS, EDIT_TAB_SPEC } from '../../definitions/employee-profile.constants';

export default function EmployeeEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { filters, setFilter } = useUrlFilters(EDIT_TAB_SPEC);

  const { data, isLoading, isError, refetch } = useEmployee(id);
  const employee = data?.data;

  const backToView = () => navigate(`/employees/${id}`);

  if (isError) return <ErrorState onRetry={refetch} />;
  if (isLoading) return <EditSkeleton />;
  if (!employee) {
    return (
      <EmptyState
        icon={UserX}
        title="Employee not found"
        description="It may have been deleted since this link was made."
        action={
          <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
            Back to employees
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title={`Edit ${employee.fullName}`}
        description={`Badge code ${employee.employeeId}. Each section saves on its own.`}
        actions={
          <Button variant="outline" onClick={backToView}>
            <Eye />
            View profile
          </Button>
        }
      />

      <Tabs value={filters.tab} onValueChange={value => setFilter('tab', String(value))}>
        <TabsList>
          {EDIT_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent keepMounted value="details">
          <EmployeeForm initialData={employee} onSuccess={backToView} onCancel={backToView} />
        </TabsContent>

        <TabsContent keepMounted value="family">
          <FamilyInfoForm employeeId={employee.id} familyInfo={employee.familyInfo} />
        </TabsContent>

        <TabsContent keepMounted value="identity">
          <GovtIdsForm employeeId={employee.id} govtIds={employee.govtIds} />
        </TabsContent>

        <TabsContent keepMounted value="bank">
          <BankDetailsForm employeeId={employee.id} bankDetails={employee.bankDetails} />
        </TabsContent>

        <TabsContent keepMounted value="education">
          <EducationTab employeeId={employee.id} records={employee.educationRecords} />
        </TabsContent>

        <TabsContent keepMounted value="certificates">
          <CertificatesTab employeeId={employee.id} records={employee.certificates} />
        </TabsContent>

        <TabsContent keepMounted value="employment">
          <EmploymentHistoryTab employeeId={employee.id} records={employee.employmentHistories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EditSkeleton() {
  return (
    <div className="space-y-4 pb-4">
      <Skeleton className="h-9 w-full" />
      {[0, 1].map(section => (
        <div key={section} className="m-panel m-panel-shine space-y-4 p-5">
          <Skeleton className="h-3 w-24" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

