import { z } from "zod";

export type LookupConfig<T extends string> = Record<
  T,
  {
    label: string;
    badgeVariant: string;
    icon?: React.ComponentType<{ className?: string }>;
    iconClassName?: string;
    className?: string;
  }
>;

export function createLookup<T extends string>(
  config: LookupConfig<T>,
  name?: string,
) {
  const entries = Object.entries(config) as [T, LookupConfig<T>[T]][];
  const values = entries.map(([key]) => key);

  function warn(value: string) {
    console.warn(
      `[Lookup${name ? `:${name}` : ""}] Unknown or missing value: "${value}". Expected one of: ${values.join(", ")}`,
    );
  }

  function resolve(value: string | null | undefined) {
    if (!value || !Object.prototype.hasOwnProperty.call(config, value)) {
      warn(String(value));
      return null;
    }
    return config[value as T];
  }

  return {
    config,
    keys: Object.keys(config).reduce(
      (acc, key) => {
        acc[key as T] = key as T;
        return acc;
      },
      {} as Record<T, T>,
    ),
    values,
    options: entries.map(([value, meta]) => ({
      value,
      label: meta.label,
    })),
    resolve,
    toZodEnum() {
      return z.enum(values as [T, ...T[]]);
    },
  };
}
