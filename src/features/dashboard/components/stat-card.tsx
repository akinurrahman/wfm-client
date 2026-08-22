import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
};

export function StatCard({ label, value, delta, trend, icon: Icon }: Props) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="m-panel m-panel-shine p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-medium tracking-wide text-text-low uppercase">
          {label}
        </span>
        <span className="flex size-8 items-center justify-center rounded-full border border-brand-line bg-brand-soft text-brand">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>

      <p className="tnum mt-5 font-serif text-[2.25rem] leading-none text-text-hi">{value}</p>

      <div className="mt-3.5 flex items-center gap-1.5 text-[12px]">
        <TrendIcon
          aria-hidden="true"
          className={cn('size-3.5', trend === 'up' ? 'text-settled' : 'text-overdue')}
        />
        <span className={cn('tnum', trend === 'up' ? 'text-settled' : 'text-overdue')}>
          {delta}
        </span>
        <span className="text-text-low">vs last week</span>
      </div>
    </div>
  );
}
