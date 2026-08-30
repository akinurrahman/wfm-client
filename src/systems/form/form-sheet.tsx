import type { DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { Form } from './form';
import { FormActions } from './form-actions';

type Props<TValues extends FieldValues> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Form identity. Reopening on a different record has to start from that
   *  record, not from what the last edit left behind, so pass its id. */
  formKey?: string;
  schema: z.ZodType<TValues>;
  defaultValues?: DefaultValues<TValues>;
  submitLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
  /** Closing is the caller's call: a mutation-backed sheet closes in its
   *  onSuccess so a rejected write keeps the typed values on screen. */
  onSubmit: (values: TValues, form: UseFormReturn<TValues>) => void | Promise<void>;
  children: React.ReactNode | ((form: UseFormReturn<TValues>) => React.ReactNode);
  /** Width override, e.g. `sm:max-w-2xl` for a two-column form. */
  className?: string;
};

/** Every write in this app happens in the same drawer: header, a scrolling
 *  field list, and a pinned action bar. Only the fields differ, so everything
 *  around them lives here. */
export function FormSheet<TValues extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  formKey,
  schema,
  defaultValues,
  submitLabel,
  cancelLabel,
  pendingLabel,
  isPending,
  onSubmit,
  children,
  className,
}: Props<TValues>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn('w-full gap-0 p-0 sm:max-w-md', className)}>
        <SheetHeader className="border-b border-hairline p-6">
          <SheetTitle className="display-title text-[15px] leading-tight text-text-hi">
            {title}
          </SheetTitle>
          {description ? (
            <SheetDescription className="text-[13px] leading-relaxed text-text-mid">
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <Form<TValues>
          key={formKey}
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {form => (
            <>
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
                {typeof children === 'function' ? children(form) : children}
              </div>

              <FormActions
                submitLabel={submitLabel}
                cancelLabel={cancelLabel}
                pendingLabel={pendingLabel}
                isPending={isPending}
                onCancel={() => onOpenChange(false)}
              />
            </>
          )}
        </Form>
      </SheetContent>
    </Sheet>
  );
}
