import { Textarea } from '@/components/ui/textarea';

import { useCascade } from '../hooks/use-cascade';
import type { BaseFieldProps } from '../types';
import { FieldShell } from './field-shell';

type Props = BaseFieldProps & {
  rows?: number;
  maxLength?: number;
};

export function TextareaField({
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  dependsOn,
  alwaysVisible,
  rows = 4,
  maxLength,
}: Props) {
  const { gated } = useCascade({ name, dependsOn, emptyValue: '' });

  return (
    <FieldShell<string>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      hidden={gated && !alwaysVisible}
    >
      {({ id, value, onChange, onBlur, ref, invalid, describedBy }) => (
        <Textarea
          id={id}
          ref={ref}
          value={value ?? ''}
          onChange={event => onChange(event.target.value)}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled || gated}
          maxLength={maxLength}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      )}
    </FieldShell>
  );
}
