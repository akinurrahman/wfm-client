import { AlertTriangle, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  message?: string;
  /** Shown verbatim so a user can quote it in a support ticket. */
  correlationId?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = 'Could not load this data',
  message,
  correlationId,
  onRetry,
  className,
}: Props) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-3 rounded-lg border border-overdue/25 bg-overdue-soft px-4 py-3.5 sm:flex-row sm:items-center',
        className
      )}
    >
      <AlertTriangle className="size-4 shrink-0 text-overdue" />

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-hi">{title}</p>
        {message ? <p className="mt-0.5 text-[13px] text-text-mid">{message}</p> : null}
        {correlationId ? (
          <p className="mt-0.5 font-mono text-[11px] text-text-low">
            Correlation ID: {correlationId}
          </p>
        ) : null}
      </div>

      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
          <RotateCcw />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
