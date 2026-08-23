import { Input } from '@/components/ui/input';

import { FieldShell } from './field-shell';

type Props = {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Wall-clock time as `HH:mm`. The native control brings each platform its own
 *  familiar picker and its own 12h/24h preference, which no custom dropdown
 *  pair matches. */
export function TimeField({ name, label, description, required, disabled, className }: Props) {
  return (
    <FieldShell<string>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
    >
      {({ id, value, onChange, onBlur, invalid, describedBy }) => (
        <Input
          id={id}
          type="time"
          value={value ?? ''}
          onChange={event => onChange(event.target.value || undefined)}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="h-10 tabular-nums sm:h-9"
        />
      )}
    </FieldShell>
  );
}
