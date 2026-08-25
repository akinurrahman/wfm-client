import { useMemo } from 'react';

import { Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router';

import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { Button } from '@/components/ui/button';
import { useDesignationOptions } from '@/features/designations';
import { useConfirmation } from '@/systems/confirmation/hooks/use-confirmation';
import { FilterPopover, useUrlFilters, type FilterConfig } from '@/systems/filters';
import { DataTable } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';

import { useDeleteEmployee } from '../../api/employee.mutations';
import { useEmployeeList } from '../../api/employee.queries';
import { employeeColumns } from '../../components/employees/employee-columns';
import {
  EMPLOYEE_FILTER_SPEC,
  EMPLOYEE_STATUS_OPTIONS,
} from '../../definitions/employee.constants';
import { employeeTypeLookup, genderLookup } from '../../definitions/employee.lookup';
import type { EmployeeListItem } from '../../definitions/employee.types';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(EMPLOYEE_FILTER_SPEC);

  const { data, isLoading, isError, refetch } = useEmployeeList(filters);
  const { data: designationOptions = [] } = useDesignationOptions();
  const deleteEmployee = useDeleteEmployee();
  const { confirm } = useConfirmation<EmployeeListItem>();

  const askDelete = (employee: EmployeeListItem) =>
    confirm({
      item: employee,
      title: 'Delete employee',
      description: item =>
        `${item.fullName} and their login are removed for good, along with their attendance history. Someone who is leaving should be off-boarded through the exit flow instead.`,
      variant: 'delete',
      // this settles, so the dialog closes either way.
      onConfirm: item =>
        deleteEmployee.mutateAsync(item.id).then(
          () => undefined,
          () => undefined
        ),
    });

  /** Four narrowing controls would fill the toolbar, so they live behind one
   *  trigger. `#` is the popover's clear sentinel: applying it drops the param. */
  const filterConfig = useMemo<FilterConfig[]>(
    () => [
      {
        key: 'designationId',
        label: 'Designation',
        type: 'select',
        span: 'full',
        placeholder: 'Any designation',
        options: [{ value: '#', label: 'Any designation' }, ...designationOptions],
      },
      {
        key: 'employeeType',
        label: 'Type',
        type: 'select',
        placeholder: 'Any type',
        options: [{ value: '#', label: 'Any type' }, ...employeeTypeLookup.options],
      },
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        placeholder: 'Any gender',
        options: [{ value: '#', label: 'Any gender' }, ...genderLookup.options],
      },
      {
        key: 'isActive',
        label: 'Status',
        type: 'select',
        span: 'full',
        placeholder: 'Any status',
        options: [{ value: '#', label: 'Any status' }, ...EMPLOYEE_STATUS_OPTIONS],
      },
    ],
    [designationOptions]
  );

  const columns = useMemo(
    () =>
      employeeColumns({
        onView: employee => navigate(`/employees/${employee.id}`),
        onEdit: employee => navigate(`/employees/${employee.id}/edit`),
        onDelete: askDelete,
      }),
    // askDelete closes over the delete mutation, which is stable per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, deleteEmployee, confirm]
  );

  return (
    <div className="pb-4">
      <PageHeader
        title="Employees"
        description="Everyone on rolls. Attendance, leave and assets all point back at these records."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          {/* No reset here: the popover carries its own Clear, and two clear
              affordances in one row is one too many. */}
          <FilterBar
            actions={
              <Button
                className="m-brand-fill h-10 w-full sm:h-8 sm:w-auto"
                onClick={() => navigate('/employees/new')}
              >
                <Plus />
                New employee
              </Button>
            }
          >
            <SearchInput
              value={filters.search}
              onChange={value => setFilter('search', value)}
              placeholder="Name, badge code or email"
              label="Search employees"
              className="sm:w-72"
            />
            <FilterPopover
              config={filterConfig}
              // A narrower filter must not land on an empty page 7.
              resetOnApply={[EMPLOYEE_FILTER_SPEC.page.param]}
              className="h-10 w-full sm:h-8 sm:w-auto"
            />
          </FilterBar>

          <DataTable
            columns={columns}
            data={data?.data ?? []}
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={page => setFilter('page', page)}
            onRowClick={employee => navigate(`/employees/${employee.id}`)}
            emptyState={
              isFiltered ? (
                <EmptyState
                  icon={Users}
                  title="No employees match these filters"
                  description="Try a different designation or status, or clear the search."
                  action={
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={Users}
                  title="No employees yet"
                  description="Add the first one. A designation and a shift have to exist before you can."
                  action={
                    <Button
                      size="sm"
                      className="m-brand-fill"
                      onClick={() => navigate('/employees/new')}
                    >
                      <Plus />
                      New employee
                    </Button>
                  }
                />
              )
            }
          />
        </>
      )}
    </div>
  );
}
