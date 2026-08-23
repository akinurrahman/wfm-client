import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/** "No filter" has to be a real option a person can pick, but it is not a value
 *  the API ever sees, so it travels under a sentinel and is mapped back out. */
const ANY = '__any';

type Props = {
  value?: string;
  onChange: (value?: string) => void;
  options: readonly { value: string; label: string }[];
  /** Doubles as the accessible name, since a filter bar has no visible label. */
  placeholder: string;
  /** Copy for the clear entry, e.g. "All categories". */
  anyLabel?: string;
  /** Off for a filter that always holds a value, where a clear entry would
   *  just be a second way to pick the default. */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
};

export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  anyLabel = 'All',
  clearable = true,
  disabled,
  className,
}: Props) {
  const items = clearable ? [{ value: ANY, label: anyLabel }, ...options] : [...options];

  return (
    <Select
      value={value ?? ANY}
      onValueChange={next => onChange(!next || next === ANY ? undefined : String(next))}
      items={items}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label={placeholder}
        className={cn('h-10 w-full sm:h-8 sm:w-auto sm:min-w-40', className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
