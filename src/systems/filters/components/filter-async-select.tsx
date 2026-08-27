import { cn } from '@/lib/utils';
import { AsyncCombobox, type AsyncFetchFn, type Option } from '@/systems/form';

/** "No filter" has to be a real option a person can pick, but it is not a value
 *  the API ever sees, so it travels under a sentinel and is mapped back out. */
const ANY = '__any';

type Props = {
  value?: string;
  onChange: (value?: string) => void;
  /** Owned by whichever feature owns the entity being picked, so the search
   *  endpoint and the label shape stay that feature's decision. */
  fetchOptions: AsyncFetchFn;
  /** Doubles as the accessible name, since a filter bar has no visible label. */
  placeholder: string;
  /** Copy for the clear entry, e.g. "All employees". */
  anyLabel?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Names the value a shared link arrived with, before the picker has fetched
   *  anything of its own. */
  initialOptions?: Option[];
  disabled?: boolean;
  className?: string;
};

/** `FilterSelect` for a list too long to ship to the browser: same place in a
 *  toolbar, same clear entry, but the options are searched server-side a page at
 *  a time. */
export function FilterAsyncSelect({
  value,
  onChange,
  fetchOptions,
  placeholder,
  anyLabel = 'All',
  searchPlaceholder,
  emptyMessage,
  initialOptions,
  disabled,
  className,
}: Props) {
  return (
    <AsyncCombobox
      value={value ?? ANY}
      onChange={next => onChange(!next || next === ANY ? undefined : next)}
      fetchOptions={fetchOptions}
      leadingOptions={[{ value: ANY, label: anyLabel }]}
      initialOptions={initialOptions}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      ariaLabel={placeholder}
      disabled={disabled}
      className={cn('h-10 w-full sm:h-8 sm:w-auto sm:min-w-40', className)}
    />
  );
}
