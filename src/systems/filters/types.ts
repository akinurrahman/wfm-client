export type FilterType = 'date' | 'select' | 'radio' | 'switch';

export interface FilterOption {
  label: string;
  value: string;
}

export type SpanValue = 'full' | 'half';

export interface ResponsiveSpan {
  mobile?: SpanValue;
  desktop?: SpanValue;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  span?: SpanValue | ResponsiveSpan;
  options?: FilterOption[];
  defaultValue?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  placeholder?: string;
  dependsOn?: string;
  alwaysVisible?: boolean;
  optionsFn?: (filters: Record<string, string | undefined>) => FilterOption[];
}
