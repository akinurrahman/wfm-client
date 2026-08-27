import type { DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';

/** Derives react-hook-form defaults from a Zod object schema.
 *
 *  A field registered without a default starts as `undefined`, so on submit
 *  `z.string().min(2, 'msg')` fails Zod's type check first and the custom
 *  message never shows, plus React logs a controlled/uncontrolled warning.
 *  Seeding strings, arrays and enums with their natural empty fixes both.
 *  Numbers and booleans stay undefined so required still fires and numeric
 *  coercion stays correct. */
export function getDefaults<T extends FieldValues>(schema: z.ZodType<T>): DefaultValues<T> {
  const shape = (schema as { shape?: Record<string, unknown> }).shape;
  if (!shape || typeof shape !== 'object') return {} as DefaultValues<T>;

  const out: Record<string, unknown> = {};
  for (const key in shape) {
    const value = emptyFor(shape[key]);
    if (value !== undefined) out[key] = value;
  }
  return out as DefaultValues<T>;
}

type ZodInternal = { def?: { type?: string; innerType?: unknown; defaultValue?: unknown } };

function emptyFor(field: unknown): unknown {
  const def = (field as ZodInternal)?.def;
  switch (def?.type) {
    case 'string':
    case 'enum':
      return '';
    case 'array':
      return [];
    case 'default': {
      const fallback = def.defaultValue;
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    case 'optional':
    case 'nullable':
      return emptyFor(def.innerType);
    default:
      return undefined;
  }
}
