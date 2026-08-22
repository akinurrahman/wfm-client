import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Pagination } from '@/lib/api/types';
import { cn } from '@/lib/utils';

import { DataTablePagination } from './data-table-pagination';

declare module '@tanstack/react-table' {
  // Both parameters are fixed by the interface being merged into, even though
  // `align` uses neither.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Declared once per column and applied to the header, the cell and the
     *  loading skeleton together, so a money column can never end up with a
     *  left-aligned label above right-aligned figures. */
    align?: 'left' | 'right' | 'center';
  }
}

const ALIGN_CLASS = {
  left: '',
  right: 'text-right',
  center: 'text-center',
} as const;

type Props<TData> = {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  /** Rendered in place of rows when there is no data and nothing is loading.
   *  The table owns this so a page never stacks an empty state above a table
   *  that already has one. */
  emptyState?: React.ReactNode;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: TData) => void;
  skeletonRows?: number;
  className?: string;
};

/** Sorting, filtering and paging are all server-driven in this app, so the
 *  table only needs the core row model - it renders what the query returned. */
export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyState,
  pagination,
  onPageChange,
  onRowClick,
  skeletonRows = 8,
  className,
}: Props<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Keeps the first paint the same height as the loaded table, so the page
  // does not jump when rows arrive.
  const showSkeleton = isLoading && data.length === 0;
  const showEmpty = !isLoading && data.length === 0;

  return (
    <div className={cn('m-panel m-panel-shine overflow-hidden', className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className={ALIGN_CLASS[header.column.columnDef.meta?.align ?? 'left']}
                  style={{ width: header.column.columnDef.size }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody
          // Dims stale rows while a filter change is in flight, instead of
          // blanking the table - placeholderData keeps the previous page.
          className={cn(isLoading && data.length > 0 && 'opacity-60 transition-opacity')}
        >
          {showSkeleton
            ? Array.from({ length: skeletonRows }, (_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-transparent">
                  {columns.map((column, cellIndex) => (
                    <TableCell key={`skeleton-cell-${cellIndex}`}>
                      <Skeleton
                        className={cn(
                          'h-4 w-full max-w-28',
                          column.meta?.align === 'right' && 'ml-auto',
                          column.meta?.align === 'center' && 'mx-auto'
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-interactive={onRowClick ? '' : undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? 'button' : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  onKeyDown={
                    onRowClick
                      ? event => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={ALIGN_CLASS[cell.column.columnDef.meta?.align ?? 'left']}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

          {showEmpty ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>

      {pagination && onPageChange ? (
        <DataTablePagination pagination={pagination} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}

export type { ColumnDef };
