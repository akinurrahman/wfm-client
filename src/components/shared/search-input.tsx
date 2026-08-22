import { useEffect, useRef, useState } from 'react';

import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = {
  /** The committed value, normally read straight out of the URL. */
  value?: string;
  /** Fired after the debounce, with `undefined` once the box is empty. */
  onChange: (value?: string) => void;
  placeholder?: string;
  /** Icon-only field, so it needs its own name for screen readers. */
  label?: string;
  debounceMs?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Debounced search box. Typing stays in local state and only lifts into the
 *  caller - and therefore into the URL and the query key - after a pause, so a
 *  fast typist fires one request instead of one per keystroke. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  label = 'Search',
  debounceMs = 350,
  autoFocus,
  disabled,
  className,
}: Props) {
  const [draft, setDraft] = useState(value ?? '');
  const [syncedValue, setSyncedValue] = useState(value);

  // Re-sync when the value changes from elsewhere: a preset, a reset button, or
  // the back button. Adjusting state during render rather than in an effect
  // avoids a second render pass showing stale input text.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value ?? '');
  }

  // Callers pass an inline arrow, so its identity changes on every render. Held
  // in a ref, it stays out of the effect deps and a parent re-render mid-typing
  // no longer restarts the timer.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const next = draft.trim() || undefined;
    if (next === (value || undefined)) return;

    const timer = window.setTimeout(() => onChangeRef.current(next), debounceMs);
    return () => window.clearTimeout(timer);
  }, [draft, value, debounceMs]);

  /** Clearing is deliberate, so it skips the debounce. */
  const handleClear = () => {
    setDraft('');
    onChangeRef.current(undefined);
  };

  return (
    <div className={cn('relative min-w-0', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-low sm:left-2.5"
      />

      {/* 40px tall on touch, dropping to the 32px desktop scale from sm up. */}
      <Input
        type="search"
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Escape' && draft) {
            event.preventDefault();
            handleClear();
          }
        }}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        enterKeyHint="search"
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn(
          'h-10 pl-9 sm:h-8 sm:pl-8',
          // The native clear affordance would sit under ours.
          '[&::-webkit-search-cancel-button]:appearance-none',
          draft ? 'pr-9 sm:pr-8' : ''
        )}
      />

      {draft && !disabled ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-text-low transition-colors hover:text-text-hi focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:size-6"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
