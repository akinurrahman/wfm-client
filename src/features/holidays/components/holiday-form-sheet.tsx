import type { DefaultValues } from 'react-hook-form';

import { toCalendarDate } from '@/lib/time';
import { DateField, FormSheet, SwitchField, TagsField } from '@/systems/form';

import { useCreateHoliday, useUpdateHoliday } from '../api/holiday.mutations';
import { HOLIDAY_NAMES_MAX } from '../definitions/holiday.constants';
import { holidayFormSchema, type HolidayFormValues } from '../definitions/holiday.schema';
import type { Holiday } from '../definitions/holiday.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday?: Holiday;
};

export function HolidayFormSheet({ open, onOpenChange, holiday }: Props) {
  const isEdit = Boolean(holiday);

  const createHoliday = useCreateHoliday();
  const updateHoliday = useUpdateHoliday(holiday?.id ?? '');
  const mutation = isEdit ? updateHoliday : createHoliday;

  const defaultValues: DefaultValues<HolidayFormValues> = holiday
    ? {
        names: holiday.names,
        date: toCalendarDate(holiday.date),
        isOptional: holiday.isOptional,
      }
    : { names: [], isOptional: false };

  return (
    <FormSheet<HolidayFormValues>
      open={open}
      onOpenChange={onOpenChange}
      formKey={holiday?.id ?? 'new'}
      title={isEdit ? 'Edit holiday' : 'New holiday'}
      description="One entry per calendar day. A day already on the calendar cannot be added twice."
      schema={holidayFormSchema}
      defaultValues={defaultValues}
      submitLabel={isEdit ? 'Save changes' : 'Add holiday'}
      isPending={mutation.isPending}
      onSubmit={values => mutation.mutate(values, { onSuccess: () => onOpenChange(false) })}
    >
      <DateField name="date" label="Date" placeholder="Pick the day" required />

      <TagsField
        name="names"
        label="Observed as"
        placeholder="Diwali"
        maxItems={HOLIDAY_NAMES_MAX}
        description="Festivals collide, so one day can carry several names."
        required
      />

      <SwitchField
        name="isOptional"
        label="Optional holiday"
        description="Restricted or floating. The day still counts as working for attendance."
      />
    </FormSheet>
  );
}
