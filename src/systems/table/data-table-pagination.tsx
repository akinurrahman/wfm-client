import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Pagination } from '@/lib/api/types';
import { cn } from '@/lib/utils';

type Props = {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Windowed page numbers with ellipses, so a 63-page portfolio does not render
 *  63 buttons. Always shows first and last. */
function pageWindow(current: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const visible = [...pages].filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  return visible.flatMap((page, index) => {
    const previous = visible[index - 1];
    return previous !== undefined && page - previous > 1 ? (['gap', page] as const) : [page];
  });
}

export function DataTablePagination({ pagination, onPageChange, className }: Props) {
  const { page, limit, total, totalPages, hasNext, hasPrev } = pagination;

  if (total === 0) return null;

  const firstRow = (page - 1) * limit + 1;
  const lastRow = Math.min(page * limit, total);

  return (
    <div
      className={cn(
        // Same band as the header, so the rows read as bracketed by chrome.
        'flex flex-col-reverse items-center justify-between gap-3 border-t border-hairline-strong bg-table-head px-4 py-3 sm:flex-row',
        className
      )}
    >
      <p className="text-[12px] text-text-mid" data-numeric>
        Showing {firstRow.toLocaleString('en-IN')}-{lastRow.toLocaleString('en-IN')} of{' '}
        {total.toLocaleString('en-IN')}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>

        {pageWindow(page, totalPages).map((entry, index) =>
          entry === 'gap' ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="px-1 text-[12px] text-text-low select-none"
            >
              &hellip;
            </span>
          ) : (
            <Button
              key={entry}
              variant={entry === page ? 'secondary' : 'ghost'}
              size="icon-sm"
              aria-label={`Page ${entry}`}
              aria-current={entry === page ? 'page' : undefined}
              onClick={() => onPageChange(entry)}
              className={cn('text-[12px]', entry === page && 'text-text-hi')}
              data-numeric
            >
              {entry}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </nav>
    </div>
  );
}
