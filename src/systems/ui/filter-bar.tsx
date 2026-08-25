import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  /** True only while something is off its default, so a pristine screen never
   *  offers to clear filters that were never applied. */
  isFiltered?: boolean;
  /** Omitted by a toolbar whose controls already own a clear action, e.g. one
   *  built around FilterPopover, so the row does not offer it twice. */
  onReset?: () => void;
  /** Page-level actions - typically the "new record" button. Kept in this row
   *  rather than beside the page title so the header stays copy only. */
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** The toolbar every list screen sits under: controls stack full width on a
 *  phone and settle into a row from sm up. */
export function FilterBar({ isFiltered, onReset, actions, className, children }: Props) {
  return (
    <div className={cn('mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center', className)}>
      {children}

      {isFiltered && onReset ? (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-10 self-start sm:h-8">
          <X />
          Clear filters
        </Button>
      ) : null}

      {actions ? (
        <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row sm:items-center">{actions}</div>
      ) : null}
    </div>
  );
}
