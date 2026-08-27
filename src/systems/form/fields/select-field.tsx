import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { useCascade } from '../hooks/use-cascade';
import { gatedText } from '../lib/cascade';
import type { BaseFieldProps, Option, OptionsFn } from '../types';
import { FieldShell } from './field-shell';

type SingleProps = BaseFieldProps & {
  multi?: false;
  options?: Option[];
  optionsFn?: OptionsFn;
};

type MultiProps = BaseFieldProps & {
  multi: true;
  options?: Option[];
  optionsFn?: OptionsFn;
  /** Collapses everything past this many selections into a "+n more" chip. */
  maxCount?: number;
  showSelectAll?: boolean;
};

export type SelectFieldProps = SingleProps | MultiProps;

export function SelectField(props: SelectFieldProps) {
  return props.multi ? <MultiSelectField {...props} /> : <SingleSelectField {...props} />;
}

/** Static options can also be a function of the form's live values, which is how
 *  one field narrows another's list without a round trip. */
function useResolvedOptions(options?: Option[], optionsFn?: OptionsFn): Option[] {
  const form = useFormContext();
  const values = useWatch({ control: form.control });

  return useMemo(() => {
    if (optionsFn) return optionsFn((values as Record<string, unknown>) ?? {});
    return options ?? [];
  }, [optionsFn, options, values]);
}

/** Sits outside the item list, so the pointer press must not move focus off the
 *  search input or the popup closes before the click lands. */
function BulkAction({
  disabled,
  onClick,
  children,
}: {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={event => event.preventDefault()}
      onClick={onClick}
      className="cursor-pointer rounded-sm px-1 text-xs text-text-mid transition-colors hover:text-text-hi disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SingleSelectField({
  name,
  label,
  description,
  required,
  placeholder = 'Select...',
  disabled,
  className,
  dependsOn,
  alwaysVisible,
  options,
  optionsFn,
}: SingleProps) {
  const { gated, dependsOnList } = useCascade({ name, dependsOn, emptyValue: '' });
  const resolved = useResolvedOptions(options, optionsFn);

  return (
    <FieldShell<string>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      hidden={gated && !alwaysVisible}
    >
      {({ id, value, onChange, invalid, describedBy }) => (
        <Select
          value={value || null}
          onValueChange={next => onChange(next === null ? '' : String(next))}
          items={resolved}
          disabled={disabled || gated}
        >
          <SelectTrigger
            id={id}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className="w-full"
          >
            <SelectValue placeholder={gated ? gatedText(dependsOnList) : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {resolved.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldShell>
  );
}

function MultiSelectField({
  name,
  label,
  description,
  required,
  placeholder = 'Select...',
  disabled,
  className,
  dependsOn,
  alwaysVisible,
  options,
  optionsFn,
  maxCount,
  showSelectAll,
}: MultiProps) {
  const { gated, dependsOnList } = useCascade({ name, dependsOn, emptyValue: [] });
  const resolved = useResolvedOptions(options, optionsFn);

  return (
    <FieldShell<string[]>
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      hidden={gated && !alwaysVisible}
    >
      {({ id, value, onChange, invalid, describedBy }) => {
        const selectedValues = value ?? [];
        const selected = selectedValues.map(
          entry => resolved.find(option => option.value === entry) ?? { value: entry, label: entry }
        );
        const shown = maxCount ? selected.slice(0, maxCount) : selected;
        const overflow = selected.length - shown.length;

        return (
          <Combobox
            multiple
            items={resolved}
            value={selected}
            onValueChange={next => onChange(next.map(option => option.value))}
            isItemEqualToValue={(a, b) => a.value === b.value}
            disabled={disabled || gated}
          >
            <ComboboxChips
              className={cn('min-h-10 sm:min-h-9', className)}
              aria-invalid={invalid || undefined}
            >
              {shown.map(option => (
                <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
              ))}
              {overflow > 0 ? (
                <span className="px-1 text-xs text-text-low">+{overflow} more</span>
              ) : null}
              <ComboboxInput
                id={id}
                aria-describedby={describedBy}
                placeholder={
                  gated ? gatedText(dependsOnList) : selected.length ? '' : placeholder
                }
              />
            </ComboboxChips>

            <ComboboxContent>
              {showSelectAll && resolved.length ? (
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-hairline px-2 py-1.5">
                  <BulkAction
                    disabled={selected.length === resolved.length}
                    onClick={() => onChange(resolved.map(option => option.value))}
                  >
                    Select all
                  </BulkAction>
                  <BulkAction disabled={!selected.length} onClick={() => onChange([])}>
                    Clear all
                  </BulkAction>
                </div>
              ) : null}
              <ComboboxEmpty>No results.</ComboboxEmpty>
              <ComboboxList>
                {(option: Option) => (
                  <ComboboxItem key={option.value} value={option}>
                    {option.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FieldShell>
  );
}
