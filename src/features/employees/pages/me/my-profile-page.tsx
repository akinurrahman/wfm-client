import { UserX } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getErrorStatus } from '@/lib/api/error';
import { formatDate, getInitials } from '@/lib/format';
import { useUrlFilters } from '@/systems/filters';

import { useMyProfile } from '../../api/employee.queries';
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

/** The same record as the admin profile screen, read through the token and with
 *  no way in to an editor: every write on this surface is admin only. */
export default function MyProfilePage() {
  const { filters, setFilter } = useUrlFilters(VIEW_TAB_SPEC);
  const { data, isLoading, isError, error, refetch } = useMyProfile();

  const employee = data?.data;
  const status = getErrorStatus(error);

  // 403 is an account with no employee row behind it, and 404 the row having
  // gone. Neither is worth a retry button, so they get their own copy.
  if (isError && (status === 403 || status === 404)) {
    return (
      <EmptyState
        icon={UserX}
        title="No employee record linked to this account"
        description="Your login exists, but HR has not connected it to an employee record yet. Ask them to link it."
      />
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;
  if (isLoading) return <ProfileSkeleton />;
  if (!employee) return null;

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title="My profile"
        description="Your record as HR holds it. Anything out of date has to be changed by them."
      />

      <IdentityCard employee={employee} />

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
          <FamilyInfoView familyInfo={employee.familyInfo} />
        </TabsContent>

        <TabsContent value="identity">
          <GovtIdsView govtIds={employee.govtIds} maskSensitive />
        </TabsContent>

        <TabsContent value="bank">
          <BankDetailsView bankDetails={employee.bankDetails} maskSensitive />
        </TabsContent>

        <TabsContent value="education">
          <EducationView records={employee.educationRecords} />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesView records={employee.certificates} />
        </TabsContent>

        <TabsContent value="employment">
          <EmploymentHistoryView records={employee.employmentHistories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Who the reader is on paper, kept above the tabs so the facts they are asked
 *  for over the phone are never more than a glance away. */
function IdentityCard({ employee }: { employee: EmployeeDetail }) {
  return (
    <section className="m-panel m-panel-shine flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3.5">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-medium tracking-wide text-brand ring-1 ring-brand-line"
        >
          {getInitials(employee.fullName)}
        </span>

        <div className="min-w-0">
          <h2 className="truncate display-title text-lg leading-tight text-text-hi">
            {employee.fullName}
          </h2>
          <p className="mt-0.5 truncate text-[13px] text-text-mid">
            {employee.designation.title}
          </p>
        </div>
      </div>

      <span aria-hidden className="hidden h-10 w-px bg-hairline sm:block" />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Fact label="Badge code">
          <span data-numeric className="font-mono text-[13px] text-text-hi">
            {employee.employeeId}
          </span>
        </Fact>

        <Fact label="Email">
          <span className="text-[13px] break-all text-text-hi">{employee.email}</span>
        </Fact>

        <Fact label="Joined">
          <span className="text-[13px] text-text-hi">
            {formatDate(employee.dateOfJoining, 'dd MMM yyyy')}
          </span>
        </Fact>

        <Fact label="Status">
          <Badge variant={employee.isActive ? 'settled' : 'secondary'}>
            {employee.isActive ? 'On rolls' : 'Exited'}
          </Badge>
        </Fact>
      </div>
    </section>
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
