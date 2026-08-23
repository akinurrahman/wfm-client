import { useMemo, useState } from 'react';

import { BriefcaseBusiness, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { FilterSelect, useUrlFilters } from '@/systems/filters';
import { DataTable, type ColumnDef } from '@/systems/table/data-table';
import { FilterBar } from '@/systems/ui/filter-bar';
import { LookupBadge } from '@/systems/ui/lookup-badge';
import { RowActions } from '@/systems/ui/row-actions';
import { useConfirmation } from '@/systems/confirmation/hooks/use-confirmation';

import { useDeleteDesignation } from '../api/designation.mutations';
import { useDesignationList } from '../api/designation.queries';
import { DESIGNATION_FILTER_SPEC } from '../definitions/designation.constants';
import { designationCategoryLookup } from '../definitions/designation.lookup';
import type { Designation } from '../definitions/designation.types';
import { DesignationFormSheet } from '../components/designation-form-sheet';

export default function DesignationListPage() {
  const { filters, setFilter, isFiltered, resetFilters } = useUrlFilters(DESIGNATION_FILTER_SPEC);

  /** `'new'` rather than a second boolean: the sheet is either closed, adding,
   *  or editing one row, and those three states cannot overlap. */
  const [editing, setEditing] = useState<Designation | 'new' | null>(null);

  const { data, isLoading, isError, refetch } = useDesignationList({ category: filters.category });
  const deleteDesignation = useDeleteDesignation();
  const { confirm } = useConfirmation<Designation>();

  const rows = useMemo(() => {
    const all = data?.data ?? [];
    const term = filters.search?.trim().toLowerCase();
    return term ? all.filter(row => row.title.toLowerCase().includes(term)) : all;
  }, [data, filters.search]);

  const askDelete = (designation: Designation) =>
    confirm({
      item: designation,
      title: 'Delete designation',
      description: item =>
        `${item.title} will be removed. Employees already holding it keep the record, but it can no longer be assigned.`,
      variant: 'delete',
      // The global mutation toast has already reported the failure by the time
      // this settles, so the dialog closes either way rather than rejecting
      // into nothing.
      onConfirm: item => deleteDesignation.mutateAsync(item.id).then(() => undefined, () => undefined),
    });

  const columns = useMemo<ColumnDef<Designation>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => <span className="font-medium text-text-hi">{row.original.title}</span>,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <LookupBadge lookup={designationCategoryLookup} value={row.original.category} />
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 120,
        meta: { align: 'right' },
        cell: ({ row }) => (
          <RowActions
            subject={row.original.title}
            onEdit={() => setEditing(row.original)}
            onDelete={() => askDelete(row.original)}
          />
        ),
      },
    ],
    // askDelete closes over the delete mutation, which is stable per render of
    // this page; the columns only need rebuilding when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteDesignation, confirm]
  );

  const total = data?.data?.length ?? 0;

  return (
    <div className="pb-4">
      <PageHeader
        title="Designations"
        description="Job titles employees are hired into. Every employee record points at one."
      />

      {isError ? (
        <ErrorState onRetry={refetch} className="mb-4" />
      ) : (
        <>
          <FilterBar
            isFiltered={isFiltered}
            onReset={resetFilters}
            actions={
              <Button
                className="m-brand-fill h-10 w-full sm:h-8 sm:w-auto"
                onClick={() => setEditing('new')}
              >
                <Plus />
                New designation
              </Button>
            }
          >
            <SearchInput
              value={filters.search}
              onChange={value => setFilter('search', value)}
              placeholder="Search titles"
              label="Search designations"
              className="sm:w-64"
            />
            <FilterSelect
              value={filters.category}
              onChange={value => setFilter('category', value)}
              options={designationCategoryLookup.options}
              placeholder="Category"
              anyLabel="All categories"
            />
          </FilterBar>

          <DataTable
            columns={columns}
            data={rows}
            isLoading={isLoading}
            emptyState={
              isFiltered ? (
                <EmptyState
                  icon={BriefcaseBusiness}
                  title="No designations match these filters"
                  description="Try a different category, or clear the search."
                  action={
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={BriefcaseBusiness}
                  title="No designations yet"
                  description="Add the first one, then employees can be hired into it."
                  action={
                    <Button size="sm" className="m-brand-fill" onClick={() => setEditing('new')}>
                      <Plus />
                      New designation
                    </Button>
                  }
                />
              )
            }
          />

          {total ? (
            <p className="mt-3 text-[12px] text-text-low" data-numeric>
              {rows.length === total
                ? `${total} designation${total === 1 ? '' : 's'}`
                : `${rows.length} of ${total} designations`}
            </p>
          ) : null}
        </>
      )}

      <DesignationFormSheet
        open={editing !== null}
        designation={editing === 'new' ? undefined : (editing ?? undefined)}
        onOpenChange={open => setEditing(open ? editing : null)}
      />
    </div>
  );
}
