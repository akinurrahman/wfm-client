import { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useCascade } from '../hooks/use-cascade';
import type { BaseFieldProps } from '../types';
import { FieldShell } from './field-shell';

type InputType = 'text' | 'email' | 'url' | 'tel' | 'password' | 'number';

type Props = BaseFieldProps & {
  type?: InputType;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  autoComplete?: string;
};

export function InputField({
  name,
  label,
  description,
  required,
  placeholder,
  type = 'text',
  disabled,
  className,
  dependsOn,
  alwaysVisible,
  min,
  max,
  step,
  maxLength,
  autoComplete,
}: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const isNumber = type === 'number';

  const { gated } = useCascade({ name, dependsOn, emptyValue: isNumber ? undefined : '' });

  return (
    <FieldShell<string | number>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      hidden={gated && !alwaysVisible}
    >
      {({ id, value, onChange, onBlur, ref, invalid, describedBy }) => (
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={isPassword && show ? 'text' : type}
            value={value ?? ''}
            onChange={event => {
              const next = event.target.value;
              onChange(isNumber ? (next === '' ? undefined : Number(next)) : next);
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled || gated}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
            autoComplete={autoComplete}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn(
              'h-10 sm:h-9',
              // The native reveal control would sit under this field's own toggle.
              isPassword &&
                'pr-10 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden'
            )}
          />

          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={show ? 'Hide password' : 'Show password'}
              onClick={() => setShow(current => !current)}
              className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-text-low transition-colors hover:text-text-hi"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          ) : null}
        </div>
      )}
    </FieldShell>
  );
}
