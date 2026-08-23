import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  submitLabel: string;
  /** Present tense, shown while the write is in flight, e.g. "Saving". */
  pendingLabel?: string;
  isPending?: boolean;
  onCancel: () => void;
  cancelLabel?: string;
  className?: string;
};

/** Pinned below a scrolling field list, so the primary action stays reachable
 *  on a long form without hunting for the bottom of it. */
export function FormActions({
  submitLabel,
  pendingLabel = 'Saving',
  isPending = false,
  onCancel,
  cancelLabel = 'Cancel',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-2 border-t border-hairline bg-surface-1 px-5 py-4',
        className
      )}
    >
      <Button type="button" variant="outline" size="lg" disabled={isPending} onClick={onCancel}>
        {cancelLabel}
      </Button>

      <Button type="submit" size="lg" disabled={isPending} className="m-brand-fill">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            {pendingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
