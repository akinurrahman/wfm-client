import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

type Props = {
  value: string | null;
  /** Named in the toggle's label, so a screen reader says which number it is. */
  label: string;
  /** Digits left readable while masked, enough to check the right record. */
  visibleTail?: number;
};

/** An identity or account number read back on screen. Masked until asked for,
 *  so a screen share or a shoulder does not hand the whole number away. */
export function MaskedValue({ value, label, visibleTail = 4 }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!value) return null;

  const tail = value.slice(-visibleTail);
  const masked = `${'•'.repeat(Math.max(value.length - tail.length, 0))}${tail}`;
  const Icon = isRevealed ? EyeOff : Eye;

  return (
    <button
      type="button"
      onClick={() => setIsRevealed(prev => !prev)}
      aria-pressed={isRevealed}
      aria-label={`${isRevealed ? 'Hide' : 'Show'} ${label}`}
      className="-mx-1.5 -my-1 inline-flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span data-numeric className="font-mono">
        {isRevealed ? value : masked}
      </span>
      <Icon aria-hidden className="size-3.5 shrink-0 text-text-low" />
    </button>
  );
}
