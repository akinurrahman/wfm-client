import { useId } from 'react';

import { useController, type RefCallBack } from 'react-hook-form';

import { cn } from '@/lib/utils';

import '../form.css';

type RenderArgs<T> = {
  /** Belongs on the control itself, so the label focuses it. */
  id: string;
  name: string;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  onBlur: () => void;
  /** Lets react-hook-form focus this control when its own validation fails. */
  ref: RefCallBack;
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
  /** Set by a cascading field while a parent is still empty. The field stays
   *  registered so its value still submits and resets. */
  hidden?: boolean;
  children: (args: RenderArgs<T>) => React.ReactNode;
};

/** The label, description and message frame every field in this app shares.
 *  Fields read react-hook-form through `useController` rather than a Controller
 *  render prop, so a control gets `id` and `aria-describedby` handed to it
 *  directly instead of through a slot that guesses which child to forward to. */
export function FieldShell<T>({
  name,
  label,
  description,
  required,
  className,
  hidden,
  children,
}: Props<T>) {
  const id = useId();
  const { field, fieldState } = useController({ name });

  const descriptionId = `${id}-description`;
  const messageId = `${id}-message`;
  const error = fieldState.error?.message;

  if (hidden) return null;

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
        name: field.name,
        value: field.value as T | undefined,
        onChange: field.onChange,
        onBlur: field.onBlur,
        ref: field.ref,
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
