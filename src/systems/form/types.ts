export type Option = { value: string; label: string };

export type OptionsFn = (formValues: Record<string, unknown>) => Option[];

export type BaseFieldProps = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** One or more parent fields. When any of them changes this field resets;
   *  with several parents it stays gated until every one has a value. */
  dependsOn?: string | string[];
  /** With `dependsOn` set the field hides until every parent has a value. Set
   *  this to keep it on screen while still auto-resetting. */
  alwaysVisible?: boolean;
};

export type AsyncFetchArgs = {
  search: string;
  page: number;
  limit: number;
  /** First parent's value, for the single-parent case. */
  parentValue?: string;
  /** Every parent's value keyed by field name, for multi-parent fetches. */
  parentValues?: Record<string, string | undefined>;
  signal?: AbortSignal;
};

export type AsyncFetchResult = {
  options: Option[];
  hasMore: boolean;
};

export type AsyncFetchFn = (args: AsyncFetchArgs) => Promise<AsyncFetchResult>;
