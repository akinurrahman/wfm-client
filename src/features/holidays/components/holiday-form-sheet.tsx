import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toCalendarDate } from '@/lib/time';
import type { DefaultValues } from 'react-hook-form';

import { DateField, Form, FormActions, SwitchField, TagsField } from '@/systems/form';

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-hairline p-5">
          <SheetTitle className="font-serif text-lg text-text-hi">
            {isEdit ? 'Edit holiday' : 'New holiday'}
          </SheetTitle>
          <SheetDescription className="text-[13px] text-text-mid">
            One entry per calendar day. A day already on the calendar cannot be added twice.
          </SheetDescription>
        </SheetHeader>

        <Form<HolidayFormValues>
          key={holiday?.id ?? 'new'}
          schema={holidayFormSchema}
          defaultValues={defaultValues}
          onSubmit={values => mutation.mutate(values, { onSuccess: () => onOpenChange(false) })}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
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
          </div>

          <FormActions
            submitLabel={isEdit ? 'Save changes' : 'Add holiday'}
            isPending={mutation.isPending}
            onCancel={() => onOpenChange(false)}
          />
        </Form>
      </SheetContent>
    </Sheet>
  );
}
