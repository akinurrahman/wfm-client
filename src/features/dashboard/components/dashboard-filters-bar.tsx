import { FilterSelect } from '@/systems/filters';
import { DateStepper } from '@/systems/ui/date-stepper';
import { FilterBar } from '@/systems/ui/filter-bar';

import { UPCOMING_DAYS_DEFAULT, UPCOMING_DAYS_OPTIONS } from '../definitions/dashboard.constants';
import type { DashboardFilters } from '../definitions/dashboard.types';

type Props = {
  filters: DashboardFilters;
  onChange: (patch: Partial<DashboardFilters>) => void;
  ariaLabel: string;
  /** What the board is describing, kept on the same line as the controls that
   *  chose it. Null until the first response lands. */
  summary?: React.ReactNode;
  /** Board-specific controls, e.g. the admin trend length. One filter row above
   *  everything it scopes, never a control inside a chart. */
  children?: React.ReactNode;
};

export function DashboardFiltersBar({ filters, onChange, ariaLabel, summary, children }: Props) {
  return (
    <FilterBar actions={summary}>
      <DateStepper value={filters.date} onChange={date => onChange({ date })} ariaLabel={ariaLabel} />

      <FilterSelect
        value={String(filters.upcomingDays)}
        onChange={value => onChange({ upcomingDays: Number(value ?? UPCOMING_DAYS_DEFAULT) })}
        options={UPCOMING_DAYS_OPTIONS}
        placeholder="Look ahead"
        clearable={false}
        className="min-w-0 sm:min-w-40"
      />

      {children}
    </FilterBar>
  );
}
