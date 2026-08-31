import { Link } from 'react-router';

import { CalendarCheck, CalendarOff } from 'lucide-react';

import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { displayNameFromEmail } from '@/lib/format';
import { useAuthStore } from '@/stores/auth.store';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { PanelSection } from '@/systems/ui/panel-section';

import { useAdminDashboard } from '../../api/admin-dashboard.queries';
import { AdminDayPanel } from '../../components/admin/admin-day-panel';
import { AdminDayStats } from '../../components/admin/admin-day-stats';
import { AdminDayTables } from '../../components/admin/admin-day-tables';
import { AdminHeadcountPanel } from '../../components/admin/admin-headcount-panel';
import { AdminLeavePanel } from '../../components/admin/admin-leave-panel';
import { AdminTrendChart } from '../../components/admin/admin-trend-chart';
import { AdminUpcomingTimeline } from '../../components/admin/admin-upcoming-timeline';
import { AdminWorkforcePanel } from '../../components/admin/admin-workforce-panel';
import { AsOfSummary } from '../../components/as-of-summary';
import { BoardSkeleton } from '../../components/board-skeleton';
import { DashboardFiltersBar } from '../../components/dashboard-filters-bar';
import {
  ADMIN_DASHBOARD_FILTER_SPEC,
  TREND_DAYS_DEFAULT,
  TREND_DAYS_OPTIONS,
} from '../../definitions/dashboard.constants';

export default function AdminDashboardPage() {
  // The board itself is about everybody else, so the only name it can greet
  // with is the caller's own.
  const user = useAuthStore(state => state.user);
  const { filters, setFilters } = useUrlFilters(ADMIN_DASHBOARD_FILTER_SPEC);
  const { data, isError, refetch } = useAdminDashboard(filters);

  const board = data?.data;

  return (
    <div className="space-y-4 pb-4">
      <PageHeader
        title={`Welcome, ${user?.fullName ?? displayNameFromEmail(user?.email)}`}
        description="The site for one day, with the run-up behind it. Every figure is derived at request time from the table that owns it, so nothing here is a cached summary of anything."
      />

      <DashboardFiltersBar
        filters={filters}
        onChange={setFilters}
        ariaLabel="Dashboard date"
        summary={
          board ? (
            <AsOfSummary asOf={board.asOf} period={board.period} cycle={board.cycle} />
          ) : null
        }
      >
        <FilterSelect
          value={String(filters.trendDays)}
          onChange={value => setFilters({ trendDays: Number(value ?? TREND_DAYS_DEFAULT) })}
          options={TREND_DAYS_OPTIONS}
          placeholder="Trend window"
          clearable={false}
          className="min-w-0 sm:min-w-40"
        />
      </DashboardFiltersBar>

      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : !board ? (
        <BoardSkeleton />
      ) : (
        <>
          <AdminDayStats
            attendance={board.attendance}
            headcount={board.headcount}
            isFuture={board.asOf.isFuture}
          />

          <PanelSection
            title={`The last ${board.trend.days} days`}
            description="Every calendar day in the window, gaps included. A day nothing was recorded on keeps its slot, because a column skipped there would report a shut site as continuous attendance."
          >
            <AdminTrendChart trend={board.trend} />
          </PanelSection>

          <AdminDayPanel
            attendance={board.attendance}
            headcount={board.headcount}
            holidayToday={board.calendar.holidayToday}
            action={
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                render={<Link to="/attendance" />}
              >
                <CalendarCheck />
                Open roster
              </Button>
            }
          />

          <div className="grid items-start gap-4 desk:grid-cols-2">
            <PanelSection
              title="Who is on rolls"
              description={`The same ${board.headcount.onRolls} people the head count reports, cut three ways. The slices sum to it exactly.`}
            >
              <AdminWorkforcePanel
                workforce={board.workforce}
                onRolls={board.headcount.onRolls}
              />
            </PanelSection>

            <PanelSection
              title="What is coming"
              description="Approved leave, holidays and birthdays on one axis. Pending requests are absent on purpose: they authorise nothing."
            >
              <AdminUpcomingTimeline
                leave={board.leave}
                calendar={board.calendar}
                from={board.asOf.date}
              />
            </PanelSection>
          </div>

          <AdminDayTables attendance={board.attendance} />

          <AdminHeadcountPanel headcount={board.headcount} isToday={board.asOf.isToday} />

          <AdminLeavePanel
            leave={board.leave}
            action={
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                render={<Link to="/leave" />}
              >
                <CalendarOff />
                Open leave
              </Button>
            }
          />
        </>
      )}
    </div>
  );
}
