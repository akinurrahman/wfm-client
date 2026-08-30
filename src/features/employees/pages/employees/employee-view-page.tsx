import { Pencil, UserX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShiftOptions } from '@/features/shifts';
import { formatDate } from '@/lib/format';
import { useUrlFilters } from '@/systems/filters';

import { useEmployee } from '../../api/employee.queries';
import { BankDetailsView } from '../../components/profile/bank-details-view';
import { CertificatesView } from '../../components/profile/certificates-view';
import { EducationView } from '../../components/profile/education-view';
import { EmployeeOverview } from '../../components/profile/employee-overview';
import { EmploymentHistoryView } from '../../components/profile/employment-history-view';
import { FamilyInfoView } from '../../components/profile/family-info-view';
import { GovtIdsView } from '../../components/profile/govt-ids-view';
import { ProfileSkeleton } from '../../components/profile/profile-skeleton';
import { VIEW_TABS, VIEW_TAB_SPEC } from '../../definitions/employee-profile.constants';
import type { EmployeeDetail } from '../../definitions/employee.types';

export default function EmployeeViewPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { filters, setFilter } = useUrlFilters(VIEW_TAB_SPEC);

  const { data, isLoading, isError, refetch } = useEmployee(id);
  const employee = data?.data;

  /** Each section hands editing over to the matching tab of the edit screen, so
   *  the reader lands where they were looking rather than at the top. */
  const editSection = (tab: string) => navigate(`/employees/${id}/edit?tab=${tab}`);

  if (isError) return <ErrorState onRetry={refetch} />;
  if (isLoading) return <ProfileSkeleton />;
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
        title={employee.fullName}
        description={`${employee.designation.title} - joined ${formatDate(employee.dateOfJoining, 'dd MMM yyyy')}`}
        actions={
          <Button variant="outline" onClick={() => navigate(`/employees/${employee.id}/edit`)}>
            <Pencil />
            Edit record
          </Button>
        }
      />

      <IdentityStrip employee={employee} />

      <Tabs value={filters.tab} onValueChange={value => setFilter('tab', String(value))}>
        <TabsList>
          {VIEW_TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <EmployeeOverview employee={employee} />
        </TabsContent>

        <TabsContent value="family">
          <FamilyInfoView
            familyInfo={employee.familyInfo}
            onEdit={() => editSection('family')}
          />
        </TabsContent>

        <TabsContent value="identity">
          <GovtIdsView govtIds={employee.govtIds} onEdit={() => editSection('identity')} />
        </TabsContent>

        <TabsContent value="bank">
          <BankDetailsView
            bankDetails={employee.bankDetails}
            onEdit={() => editSection('bank')}
          />
        </TabsContent>

        <TabsContent value="education">
          <EducationView
            records={employee.educationRecords}
            onEdit={() => editSection('education')}
          />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesView
            records={employee.certificates}
            onEdit={() => editSection('certificates')}
          />
        </TabsContent>

        <TabsContent value="employment">
          <EmploymentHistoryView
            records={employee.employmentHistories}
            onEdit={() => editSection('employment')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** The four facts every tab is read against, so nobody has to leave the tab
 *  they are in to check which record they are looking at. */
function IdentityStrip({ employee }: { employee: EmployeeDetail }) {
  const { data: shiftOptions = [] } = useShiftOptions();
  const shift = shiftOptions.find(option => option.value === employee.shiftId);

  return (
    <div className="m-panel m-panel-shine flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
      <Fact label="Badge code">
        <span data-numeric className="font-mono text-[13px] text-text-hi">
          {employee.employeeId}
        </span>
      </Fact>

      <Fact label="Email">
        <span className="text-[13px] text-text-hi">{employee.email}</span>
      </Fact>

      <Fact label="Shift">
        {shift ? (
          <span className="text-[13px] text-text-hi">{shift.label}</span>
        ) : (
          // Attendance cannot be judged without one, and every punch is dropped.
          <Badge variant="awaiting">Not assigned</Badge>
        )}
      </Fact>

      <Fact label="Status">
        <Badge variant={employee.isActive ? 'settled' : 'secondary'}>
          {employee.isActive ? 'On rolls' : 'Exited'}
        </Badge>
      </Fact>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="meta-label text-text-low">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}
