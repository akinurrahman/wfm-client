import { useId } from 'react';

import { useController } from 'react-hook-form';

import { cn } from '@/lib/utils';

type RenderArgs<T> = {
  /** Belongs on the control itself, so the label focuses it. */
  id: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  onBlur: () => void;
  invalid: boolean;
  describedBy: string;
  /** Only needed by a field that renders its own description rather than
   *  handing one to the shell. */
  descriptionId: string;
};

type Props<T> = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (args: RenderArgs<T>) => React.ReactNode;
};

/** Mirrors the label / description / message shell that @akinurrahman/form
 *  renders internally, so a field this project adds is indistinguishable from
 *  one the package ships. The package's own FieldWrapper is documented as
 *  exported but is not in the v0.0.2 bundle, so this reads react-hook-form
 *  directly instead. */
export function FieldShell<T>({
  name,
  label,
  description,
  required,
  className,
  children,
}: Props<T>) {
  const id = useId();
  const { field, fieldState } = useController({ name });

  const descriptionId = `${id}-description`;
  const messageId = `${id}-message`;
  const error = fieldState.error?.message;

  return (
    <div data-slot="form-item" className={cn('grid gap-2', className)}>
      {label ? (
        <label
          htmlFor={id}
          data-slot="form-label"
          data-error={Boolean(error)}
          className="flex items-center gap-2 text-sm leading-none font-medium select-none data-[error=true]:text-destructive"
        >
          {label}
          {required ? (
            <span aria-hidden className="-ml-1 text-destructive">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children({
        id,
        value: field.value as T | undefined,
        onChange: field.onChange,
        onBlur: field.onBlur,
        invalid: Boolean(error),
        describedBy: error ? `${descriptionId} ${messageId}` : descriptionId,
        descriptionId,
      })}

      {description ? (
        <p data-slot="form-description" id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {error ? (
        <p data-slot="form-message" id={messageId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
