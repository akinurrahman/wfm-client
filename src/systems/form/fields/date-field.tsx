import { DatePicker } from '@/components/ui/date-picker';

import { FieldShell } from './field-shell';

type Props = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
};

/** Holds a calendar date as `YYYY-MM-DD`, which is the shape every date-only
 *  field on this API expects. Never an instant, never an offset. */
export function DateField({
  name,
  label,
  description,
  placeholder,
  required,
  disabled,
  minDate,
  maxDate,
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
      {({ id, value, onChange, invalid, describedBy }) => (
        <DatePicker
          id={id}
          date={value || undefined}
          onDateChange={next => onChange(next)}
          placeholder={placeholder}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="h-10 sm:h-9"
        />
      )}
    </FieldShell>
  );
}
