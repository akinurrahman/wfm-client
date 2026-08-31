import { Link } from 'react-router';

import { CalendarDays, CalendarOff, UserX } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { designationCategoryLookup } from '@/features/designations';
import { getErrorStatus } from '@/lib/api/error';
import { useUrlFilters } from '@/systems/filters';
import { LookupBadge } from '@/systems/ui/lookup-badge';
import { PanelSection } from '@/systems/ui/panel-section';

import { useMyDashboard } from '../../api/my-dashboard.queries';
import { AsOfSummary } from '../../components/as-of-summary';
import { BoardSkeleton } from '../../components/board-skeleton';
import { DashboardFiltersBar } from '../../components/dashboard-filters-bar';
import { HolidayList } from '../../components/holiday-list';
import { MyAnnouncementsPanel } from '../../components/me/my-announcements-panel';
import { MyLeavePanel } from '../../components/me/my-leave-panel';
import { MyMonthChartPanel } from '../../components/me/my-month-chart-panel';
import { MyMonthStats } from '../../components/me/my-month-stats';
import { MyMonthTablesPanel } from '../../components/me/my-month-tables-panel';
import { MyTodayPanel } from '../../components/me/my-today-panel';
import { DASHBOARD_FILTER_SPEC } from '../../definitions/dashboard.constants';

export default function MyDashboardPage() {
  const { filters, setFilters } = useUrlFilters(DASHBOARD_FILTER_SPEC);
  const { data, isError, error, refetch } = useMyDashboard(filters);

  const board = data?.data;

  // 403 is an account that never had an employee profile, 404 one whose profile
  // has gone. The credential is fine in both cases, so neither is worth a retry.
  const status = getErrorStatus(error);
  if (isError && (status === 403 || status === 404)) {
    return (
      <EmptyState
        icon={UserX}
        title="No employee record linked to this account"
        description="This board is built from an employee record, and your login is not connected to one. Ask HR to link it."
      />
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        // The board carries the employee's real name, so the greeting uses it
        // and falls back to the plain title until the first response lands.
        title={board ? `Welcome, ${board.employee.fullName.split(' ')[0]}` : 'My dashboard'}
        description="Your day, your cycle so far, and what is coming. Read from the same rows the roster and payroll read."
        actions={
          board ? (
            <div className="flex items-center gap-2">
              <span data-numeric className="text-[12px] text-text-mid">
                {board.employee.employeeId} · {board.employee.designation.title}
              </span>
              <LookupBadge
                lookup={designationCategoryLookup}
                value={board.employee.designation.category}
              />
            </div>
          ) : null
        }
      />

      <DashboardFiltersBar
        filters={filters}
        onChange={setFilters}
        ariaLabel="Board date"
        summary={
          board ? (
            <AsOfSummary asOf={board.asOf} period={board.period} cycle={board.cycle} />
          ) : null
        }
      />

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : !board ? (
        <BoardSkeleton />
      ) : (
        <>
          <MyMonthStats monthToDate={board.monthToDate} />

          <div className="grid gap-4 desk:grid-cols-2">
            <MyTodayPanel
              today={board.today}
              shift={board.employee.shift}
              isFuture={board.asOf.isFuture}
            />

            <MyMonthChartPanel monthToDate={board.monthToDate} />
          </div>

          <MyMonthTablesPanel monthToDate={board.monthToDate} />

          <div className="grid gap-4 desk:grid-cols-2">
            <MyLeavePanel
              leave={board.leave}
              upcomingDays={board.calendar.upcomingDays}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  render={<Link to="/my-leave" />}
                >
                  <CalendarOff />
                  My leave
                </Button>
              }
            />

            <PanelSection
              title="Next holidays"
              description={`The next five on the calendar, however far past the ${board.calendar.upcomingDays} day window they fall.`}
            >
              {board.calendar.upcomingHolidays.length ? (
                <HolidayList holidays={board.calendar.upcomingHolidays} from={board.asOf.date} />
              ) : (
                <EmptyState
                  icon={CalendarDays}
                  title="No holidays on the calendar"
                  description="Nothing has been declared after this date yet."
                  className="py-8"
                />
              )}
            </PanelSection>
          </div>

          <MyAnnouncementsPanel announcements={board.announcements} />
        </>
      )}
    </div>
  );
}
