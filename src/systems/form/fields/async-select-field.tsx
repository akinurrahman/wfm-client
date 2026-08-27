import { useState } from 'react';

import { Loader2 } from 'lucide-react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

import { AsyncCombobox } from '../controls/async-combobox';
import { useAsyncOptions } from '../hooks/use-async-options';
import { useCascade } from '../hooks/use-cascade';
import { gatedText } from '../lib/cascade';
import type { AsyncFetchFn, BaseFieldProps, Option } from '../types';
import { FieldShell } from './field-shell';

type CommonProps = BaseFieldProps & {
  fetchOptions: AsyncFetchFn;
  pageSize?: number;
  debounceMs?: number;
  /** Seeds the label cache so an edit form shows the selected label before the
   *  first page of results lands. */
  initialSelectedOptions?: Option[];
};

type SingleProps = CommonProps & { multi?: false };
type MultiProps = CommonProps & { multi: true; maxCount?: number };

export type AsyncSelectFieldProps = SingleProps | MultiProps;

export function AsyncSelectField(props: AsyncSelectFieldProps) {
  return props.multi ? <AsyncMultiSelectField {...props} /> : <AsyncSingleSelectField {...props} />;
}

/** Loading the next page on scroll rather than on a button keeps the list the
 *  only thing a person has to interact with. */
function handleScroll(hasMore: boolean, loading: boolean, loadMore: () => void) {
  return (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 24;
    if (nearBottom && hasMore && !loading) loadMore();
  };
}

function AsyncSingleSelectField({
  name,
  label,
  description,
  required,
  placeholder = 'Select...',
  disabled,
  className,
  dependsOn,
  alwaysVisible,
  fetchOptions,
  pageSize,
  debounceMs,
  initialSelectedOptions,
}: SingleProps) {
  const { parentValue, parentValues, dependsOnList, gated } = useCascade({
    name,
    dependsOn,
    emptyValue: '',
  });

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
        <AsyncCombobox
          id={id}
          value={value}
          onChange={onChange}
          fetchOptions={fetchOptions}
          parentValue={parentValue}
          parentValues={parentValues}
          placeholder={gated ? gatedText(dependsOnList) : placeholder}
          initialOptions={initialSelectedOptions}
          pageSize={pageSize}
          debounceMs={debounceMs}
          disabled={disabled || gated}
          invalid={invalid}
          describedBy={describedBy}
          className={cn('h-10 sm:h-9', className)}
        />
      )}
    </FieldShell>
  );
}

function AsyncMultiSelectField({
  name,
  label,
  description,
  required,
  placeholder = 'Select...',
  disabled,
  className,
  dependsOn,
  alwaysVisible,
  fetchOptions,
  pageSize,
  debounceMs,
  initialSelectedOptions,
  maxCount,
}: MultiProps) {
  const [open, setOpen] = useState(false);
  const { parentValue, parentValues, dependsOnList, gated } = useCascade({
    name,
    dependsOn,
    emptyValue: [],
  });

  const { options, hasMore, loading, search, setSearch, loadMore, getLabel } = useAsyncOptions({
    fetchOptions,
    parentValue,
    parentValues,
    enabled: open && !gated,
    pageSize,
    debounceMs,
    initialOptions: initialSelectedOptions,
  });

  const items = options.map(option => option.value);

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
        const selected = value ?? [];
        const shown = maxCount ? selected.slice(0, maxCount) : selected;
        const overflow = selected.length - shown.length;

        return (
          <Combobox
            multiple
            items={items}
            itemToStringLabel={getLabel}
            filter={null}
            value={selected}
            onValueChange={onChange}
            open={open}
            onOpenChange={setOpen}
            inputValue={search}
            onInputValueChange={setSearch}
            disabled={disabled || gated}
          >
            <ComboboxChips
              className={cn('min-h-10 sm:min-h-9', className)}
              aria-invalid={invalid || undefined}
            >
              {shown.map(entry => (
                <ComboboxChip key={entry}>{getLabel(entry)}</ComboboxChip>
              ))}
              {overflow > 0 ? (
                <span className="px-1 text-xs text-text-low">+{overflow} more</span>
              ) : null}
              <ComboboxInput
                id={id}
                aria-describedby={describedBy}
                placeholder={gated ? gatedText(dependsOnList) : selected.length ? '' : placeholder}
              />
            </ComboboxChips>

            <ComboboxContent>
              <ComboboxEmpty>{loading || options.length ? null : 'No results.'}</ComboboxEmpty>
              <ComboboxList onScroll={handleScroll(hasMore, loading, loadMore)}>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {getLabel(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
              <ComboboxStatus>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              </ComboboxStatus>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </FieldShell>
  );
}
