import { useState } from 'react';

import { Loader2 } from 'lucide-react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxSearch,
  ComboboxTrigger,
  ComboboxTriggerText,
  ComboboxStatus,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

import { useAsyncOptions } from '../hooks/use-async-options';
import type { AsyncFetchFn, Option } from '../types';

type Props = {
  value?: string;
  /** Empty string means nothing is selected, which is what both a form field
   *  and a cleared filter want back. */
  onChange: (value: string) => void;
  fetchOptions: AsyncFetchFn;
  placeholder?: string;
  /** Pinned above the fetched page and never filtered by the search, e.g. a
   *  filter's "All employees" clear entry. */
  leadingOptions?: Option[];
  /** Seeds the label cache so a trigger built from a stored id shows a name
   *  before the first page lands. */
  initialOptions?: Option[];
  parentValue?: string;
  parentValues?: Record<string, string | undefined>;
  disabled?: boolean;
  pageSize?: number;
  debounceMs?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  id?: string;
  ariaLabel?: string;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

/** Server-searched, paged single-select, controlled by plain props. Sits below
 *  both entry points on purpose: `AsyncSelectField` binds it to react-hook-form,
 *  `FilterAsyncSelect` binds it to the URL, and neither owns the picker. */
export function AsyncCombobox({
  value,
  onChange,
  fetchOptions,
  placeholder = 'Select...',
  leadingOptions,
  initialOptions,
  parentValue,
  parentValues,
  disabled,
  pageSize,
  debounceMs,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results.',
  id,
  ariaLabel,
  invalid,
  describedBy,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const { options, hasMore, loading, search, setSearch, loadMore, getLabel } = useAsyncOptions({
    fetchOptions,
    parentValue,
    parentValues,
    enabled: open,
    pageSize,
    debounceMs,
    initialOptions,
  });

  const items = [...(leadingOptions ?? []).map(option => option.value), ...options.map(option => option.value)];

  /** Leading entries never come back from the server, so their labels are
   *  resolved here rather than from the fetched cache. */
  const labelFor = (item: string) =>
    leadingOptions?.find(option => option.value === item)?.label ?? getLabel(item);

  /** Loading the next page on scroll rather than on a button keeps the list the
   *  only thing a person has to interact with. */
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 24;
    if (nearBottom && hasMore && !loading) loadMore();
  };

  return (
    <Combobox
      items={items}
      itemToStringLabel={labelFor}
      // The server already searched, so filtering the page again locally would
      // hide results it deliberately returned.
      filter={null}
      value={value || null}
      onValueChange={next => onChange(next ?? '')}
      open={open}
      onOpenChange={setOpen}
      inputValue={search}
      onInputValueChange={setSearch}
      disabled={disabled}
    >
      <ComboboxTrigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn('cursor-pointer', className)}
      >
        <ComboboxTriggerText placeholder={!value}>
          {value ? labelFor(value) : placeholder}
        </ComboboxTriggerText>
      </ComboboxTrigger>

      <ComboboxContent>
        <ComboboxSearch placeholder={searchPlaceholder} />
        <ComboboxEmpty>{loading || options.length ? null : emptyMessage}</ComboboxEmpty>
        <ComboboxList onScroll={handleScroll}>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {labelFor(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxStatus>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        </ComboboxStatus>
      </ComboboxContent>
    </Combobox>
  );
}
