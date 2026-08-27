import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormProvider,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import type { z } from 'zod';

import { getDefaults } from './lib/schema-defaults';

type Mode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';

type Props<T extends FieldValues> = {
  schema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (values: T, form: UseFormReturn<T>) => void | Promise<void>;
  children: React.ReactNode | ((form: UseFormReturn<T>) => React.ReactNode);
  className?: string;
  mode?: Mode;
};

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  mode = 'onSubmit',
}: Props<T>) {
  // @hookform/resolvers' overloads do not recognise Zod v4 internals behind a
  // generic T. Safe at runtime, and the suppression fails the build once they do.
  // @ts-expect-error see above
  const resolver = zodResolver(schema) as Resolver<T>;

  // Seed string, array and enum fields with their natural empty so custom
  // validation messages fire. Caller defaults always win.
  const mergedDefaults = useMemo(
    () => ({ ...getDefaults(schema), ...defaultValues }) as DefaultValues<T>,
    [schema, defaultValues]
  );

  const form = useForm<T>({ resolver, defaultValues: mergedDefaults, mode });

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(values => onSubmit(values, form))}
        className={className}
      >
        {typeof children === 'function' ? children(form) : children}
      </form>
    </FormProvider>
  );
}
