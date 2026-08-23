import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  /** Names the row, so the two buttons read as "Edit General Shift" rather
   *  than as forty identical "Edit" buttons to a screen reader. */
  subject: string;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
  className?: string;
};

/** Icon-only controls shrink to the 32px desktop scale but stay at 40px on
 *  touch, where a 32px target is a mis-tap waiting to happen. */
const ICON_BUTTON = 'size-10 sm:size-8';

export function RowActions({ subject, onEdit, onDelete, disabled, className }: Props) {
  return (
    <div className={cn('flex items-center justify-end gap-1', className)}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Edit ${subject}`}
        disabled={disabled}
        onClick={onEdit}
        className={ICON_BUTTON}
      >
        <Pencil />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${subject}`}
        disabled={disabled}
        onClick={onDelete}
        className={cn(ICON_BUTTON, 'text-text-low hover:bg-overdue-soft hover:text-overdue')}
      >
        <Trash2 />
      </Button>
    </div>
  );
}
