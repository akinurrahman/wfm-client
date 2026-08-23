import { useState } from 'react';

import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import { FieldShell } from './field-shell';

type Props = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Stops the field accepting more than the schema would allow, which is
   *  kinder than letting someone type a sixth entry and then rejecting it. */
  maxItems?: number;
  className?: string;
};

/** A free-text list. Used where the API models one row as several names, so a
 *  plain text field would have to invent a separator and a parser. */
export function TagsField({
  name,
  label,
  description,
  placeholder = 'Type and press Enter',
  required,
  disabled,
  maxItems,
  className,
}: Props) {
  const [draft, setDraft] = useState('');

  return (
    <FieldShell<string[]>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      {({ id, value, onChange, onBlur, invalid, describedBy }) => {
        const items = value ?? [];
        const isFull = maxItems !== undefined && items.length >= maxItems;

        const commit = (raw: string) => {
          const entry = raw.trim();
          // Silently ignoring a duplicate beats an error for something the
          // person can see is already there.
          if (!entry || isFull || items.includes(entry)) return;
          onChange([...items, entry]);
          setDraft('');
        };

        return (
          <div className="grid gap-2">
            <Input
              id={id}
              value={draft}
              onChange={event => setDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  commit(draft);
                  return;
                }
                // Backspace on an empty box removes the last chip, which is the
                // behaviour every tag input has trained people to expect.
                if (event.key === 'Backspace' && !draft && items.length) {
                  onChange(items.slice(0, -1));
                }
              }}
              // Losing focus with text still in the box would otherwise throw it
              // away without saying so.
              onBlur={() => {
                commit(draft);
                onBlur();
              }}
              placeholder={isFull ? `Limit of ${maxItems} reached` : placeholder}
              disabled={disabled || isFull}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className="h-10 sm:h-9"
            />

            {items.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {items.map(entry => (
                  <li key={entry}>
                    <Badge variant="secondary" className="gap-1 py-1 pr-1 pl-2.5">
                      {entry}
                      <button
                        type="button"
                        aria-label={`Remove ${entry}`}
                        disabled={disabled}
                        onClick={() => onChange(items.filter(item => item !== entry))}
                        className="flex size-5 cursor-pointer items-center justify-center rounded-full text-text-low transition-colors hover:bg-overdue-soft hover:text-overdue focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      }}
    </FieldShell>
  );
}
