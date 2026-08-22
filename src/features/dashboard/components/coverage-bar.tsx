import { cn } from '@/lib/utils';

type Props = {
  day: string;
  filled: number;
  target: number;
};

export function CoverageBar({ day, filled, target }: Props) {
  const short = filled < target;

  return (
    <div className="flex items-center gap-3">
      <span className="w-8 shrink-0 text-[12px] text-text-low">{day}</span>

      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
        <div
          className={cn('h-full rounded-full', short ? 'bg-awaiting' : 'bg-brand')}
          style={{ width: `${filled}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-text-low"
          style={{ left: `${target}%` }}
        />
      </div>

      {/* the word carries the shortfall as well as the colour does, so the row
          still reads for anyone who cannot separate the two bar tones */}
      <span className="w-16 shrink-0 text-right text-[12px] text-text-mid">
        <span className="tnum">{filled}%</span>
        {short ? <span className="ml-1 text-awaiting">short</span> : null}
      </span>
    </div>
  );
}
