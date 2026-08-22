import { DatePicker } from '@/components/ui/date-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { FilterField } from '../components/filter-field';
import type { FilterConfig } from '../types';

export function renderFilterField(
    item: FilterConfig,
    value: string | undefined,
    onChange: (v?: string) => void,
    allFilters: Record<string, string | undefined> = {}
) {
    const disabled = item.disabled;
    const resolvedOptions = item.optionsFn?.(allFilters) ?? item.options ?? [];

    switch (item.type) {
        case 'date': {
            const displayFormat = item.span === 'full' ? 'PPP' : 'yyyy-MM-dd';
            return (
                <FilterField key={item.key} label={item.label} span={item.span}>
                    <DatePicker
                        date={value}
                        onDateChange={onChange}
                        displayFormat={displayFormat}
                        placeholder={item.placeholder}
                        disabled={disabled}
                        className="h-10 sm:h-8"
                    />
                </FilterField>
            );
        }

        case 'select':
            return (
                <FilterField key={item.key} label={item.label} span={item.span}>
                    <Select
                        value={value ?? null}
                        onValueChange={v => onChange(v ?? undefined)}
                        items={resolvedOptions}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-10 w-full sm:h-8">
                            <SelectValue placeholder={item.placeholder ?? 'Select...'} />
                        </SelectTrigger>
                        <SelectContent>
                            {resolvedOptions.map(o => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FilterField>
            );

        case 'radio':
            return (
                <FilterField key={item.key} label={item.label} span={item.span}>
                    <RadioGroup
                        value={value ?? null}
                        onValueChange={v => onChange(v ?? undefined)}
                        disabled={disabled}
                        className={cn(
                            item.orientation === 'horizontal'
                                ? 'flex flex-wrap gap-4'
                                : 'grid grid-cols-1 gap-2'
                        )}
                    >
                        {resolvedOptions.map(o => {
                            const id = `${item.key}-${o.value}`;
                            return (
                                <label
                                    htmlFor={id}
                                    key={o.value}
                                    className="flex items-center gap-2 opacity-100"
                                >
                                    <RadioGroupItem value={o.value} disabled={disabled} id={id} />
                                    <span>{o.label}</span>
                                </label>
                            );
                        })}
                    </RadioGroup>
                </FilterField>
            );

        case 'switch':
            return (
                <FilterField key={item.key} label={item.label} span={item.span}>
                    <Switch
                        checked={value === 'true'}
                        disabled={disabled}
                        onCheckedChange={v => onChange(v ? 'true' : undefined)}
                    />
                </FilterField>
            );

        default:
            return null;
    }
}
