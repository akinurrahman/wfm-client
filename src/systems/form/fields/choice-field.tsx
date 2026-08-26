import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

import { FieldShell } from './field-shell';

export type ChoiceOption = {
  value: string;
  label: string;
  /** One line on what picking this means. Worth the space on a choice that
   *  changes which other fields the form asks for. */
  description?: string;
};

type Props = {
  name: string;
  label?: string;
  description?: string;
  options: readonly ChoiceOption[];
  required?: boolean;
  disabled?: boolean;
  /** Two per row from sm up, which is where a pair of cards reads best. */
  columns?: 1 | 2;
  className?: string;
};

/** A small, mutually exclusive choice laid out as cards rather than hidden in a
 *  select. Use it where the options are few and the decision steers the rest of
 *  the form; a select is still right for a long list. */
export function ChoiceField({
  name,
  label,
  description,
  options,
  required,
  disabled,
  columns = 2,
  className,
}: Props) {
  return (
    <FieldShell<string>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      {({ value, onChange, invalid, describedBy }) => (
        <RadioGroup
          value={value ?? ''}
          onValueChange={next => onChange(next === null ? undefined : String(next))}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn('grid gap-2', columns === 2 && 'sm:grid-cols-2')}
        >
          {options.map(option => {
            const checked = value === option.value;

            return (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors',
                  checked
                    ? 'border-brand-line bg-brand-soft'
                    : 'border-hairline bg-surface-2 hover:border-hairline-strong',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <RadioGroupItem value={option.value} disabled={disabled} className="mt-0.5" />

                <span className="min-w-0">
                  <span className="block text-sm leading-none font-medium text-text-hi">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-1.5 block text-[12px] leading-relaxed text-text-mid">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      )}
    </FieldShell>
  );
}
