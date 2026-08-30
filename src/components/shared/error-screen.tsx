import { cn } from '@/lib/utils';

type Props = {
  /** Big serif figure â€” a status code, or a short token like "ERR". */
  code: string;
  /** Mono rail above the code. Reads as a drafting annotation, not a heading. */
  eyebrow: string;
  title: string;
  description: string;
  /** Buttons/links. The caller owns the order so the primary recovery is first. */
  actions?: React.ReactNode;
  /** Raw technical text (stack, correlation id). Collapsed â€” a user only opens
   *  it to paste it into a ticket, so it must never crowd the recovery path. */
  detail?: string;
  className?: string;
};

/** Full-viewport failure screen. Shared shell for 404 / access denied / thrown
 *  route errors so all three read as the same surface with different copy. */
export function ErrorScreen({
  code,
  eyebrow,
  title,
  description,
  actions,
  detail,
  className,
}: Props) {
  return (
    <main
      className={cn(
        'm-sheet flex min-h-svh w-full items-center justify-center bg-background px-4 py-12',
        className
      )}
    >
      <div
        role="alert"
        className="m-panel m-panel-shine w-full max-w-lg animate-[m-rise_0.4s_ease-out] p-7 shadow-lift sm:p-9"
      >
        {/* corner ticks â€” the sheet's registration marks */}
        <Ticks />

        <div className="flex items-center gap-3">
          <span className="meta-label text-text-low">
            {eyebrow}
          </span>
          <span aria-hidden className="h-px flex-1 origin-left animate-[m-draw_0.5s_ease-out] bg-hairline" />
        </div>

        <p className="mt-5 display-title text-6xl leading-none tracking-tight text-brand tnum sm:text-7xl">
          {code}
        </p>

        <h1 className="mt-5 text-lg font-medium text-text-hi">{title}</h1>
        <p className="mt-1.5 max-w-prose text-[13px] leading-relaxed text-text-mid">
          {description}
        </p>

        {actions ? <div className="mt-7 flex flex-wrap items-center gap-2">{actions}</div> : null}

        {detail ? (
          <details className="group/detail mt-6 border-t border-hairline pt-4">
            <summary className="cursor-pointer list-none meta-label text-text-low transition-colors duration-200 hover:text-text-mid">
              Technical detail
              <span aria-hidden className="ml-2 inline-block group-open/detail:hidden">
                +
              </span>
              <span aria-hidden className="ml-2 hidden group-open/detail:inline-block">
                &minus;
              </span>
            </summary>

            <pre className="mt-3 max-h-56 overflow-auto rounded-md border border-hairline bg-surface-3/60 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-text-mid">
              {detail}
            </pre>
          </details>
        ) : null}
      </div>
    </main>
  );
}

function Ticks() {
  const base = 'pointer-events-none absolute size-3 border-brand-line';

  return (
    <span aria-hidden>
      <span className={cn(base, 'top-3 left-3 border-t border-l')} />
      <span className={cn(base, 'top-3 right-3 border-t border-r')} />
      <span className={cn(base, 'bottom-3 left-3 border-b border-l')} />
      <span className={cn(base, 'right-3 bottom-3 border-r border-b')} />
    </span>
  );
}
