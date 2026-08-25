import { MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type RowAction = {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
};

type Props = {
  /** Names the row, so the trigger reads as "Actions for Asha Verma" rather
   *  than as forty identical "Actions" buttons to a screen reader. */
  subject: string;
  actions: RowAction[];
  className?: string;
};

/** Past two actions a row of icon buttons stops being scannable and starts
 *  being a guessing game, so the third one moves everything into a menu where
 *  each action carries its own label. */
export function RowActionsMenu({ subject, actions, className }: Props) {
  return (
    <div className={cn('flex justify-end', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions for ${subject}`}
          render={
            // 40px on touch, dropping to the 32px desktop scale from sm up.
            <Button variant="ghost" size="icon" className="size-10 cursor-pointer sm:size-8" />
          }
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto min-w-44">
          {actions.map(action => (
            <DropdownMenuItem
              key={action.label}
              variant={action.variant}
              disabled={action.disabled}
              onClick={action.onSelect}
              className="cursor-pointer gap-2 px-2 py-2 sm:py-1.5"
            >
              <action.icon />
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
