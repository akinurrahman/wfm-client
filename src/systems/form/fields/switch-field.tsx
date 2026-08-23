import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { FieldShell } from './field-shell';

type Props = {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

/** A boolean reads as a row, not a stacked label over a control, so this lays
 *  the shell out sideways rather than reusing the vertical rhythm.
 *
 *  Base UI puts the `id` it is given on its hidden checkbox and names the
 *  visible switch through `aria-labelledby`, so the association has to be made
 *  explicitly here. A plain `htmlFor` alone leaves the switch unnamed. */
export function SwitchField({ name, label, description, disabled, className }: Props) {
  return (
    <FieldShell<boolean> name={name} className={cn('gap-1.5', className)}>
      {({ id, value, onChange, onBlur, invalid, describedBy, descriptionId }) => {
        const labelId = `${id}-label`;

        return (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-hairline bg-surface-2 px-3.5 py-3">
            <div className="min-w-0">
              <label
                id={labelId}
                htmlFor={id}
                className="text-sm leading-none font-medium select-none"
              >
                {label}
              </label>
              {description ? (
                <p id={descriptionId} className="mt-1.5 text-[12px] leading-relaxed text-text-mid">
                  {description}
                </p>
              ) : null}
            </div>

            <Switch
              id={id}
              checked={Boolean(value)}
              onCheckedChange={next => onChange(next)}
              onBlur={onBlur}
              disabled={disabled}
              aria-labelledby={labelId}
              aria-describedby={description ? describedBy : undefined}
              aria-invalid={invalid}
              className="mt-0.5 shrink-0"
            />
          </div>
        );
      }}
    </FieldShell>
  );
}
