type Props = {
  /** Percentage across the plot the reading belongs to. */
  anchor: number;
  children: React.ReactNode;
};

/** Held against the plot's own edges rather than centred blindly: near either
 *  end a centred card would hang outside the panel and get clipped. */
export function ChartTooltip({ anchor, children }: Props) {
  const alignment =
    anchor < 25
      ? { left: '0%', transform: 'none' }
      : anchor > 75
        ? { right: '0%', transform: 'none' }
        : { left: `${anchor}%`, transform: 'translateX(-50%)' };

  return (
    <div
      role="status"
      style={alignment}
      className="pointer-events-none absolute top-0 z-20 w-56 rounded-lg border border-hairline bg-surface-2 px-3 py-2.5 shadow-lift"
    >
      {children}
    </div>
  );
}

export function ChartCrosshair({ anchor }: { anchor: number }) {
  return (
    <span
      aria-hidden
      style={{ left: `${anchor}%` }}
      className="pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2 bg-hairline-strong"
    />
  );
}

/** A label and its value on one line, which is what every reading in these
 *  tooltips is. */
export function TooltipLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[12px] text-text-mid">{label}</span>
      <span data-numeric className="text-[12px] font-medium text-text-hi">
        {value}
      </span>
    </div>
  );
}
