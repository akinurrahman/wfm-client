import { useEffect, useRef } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import { isEmptyParent, normalizeDependsOn, watchNames } from '../lib/cascade';

type Options = {
  name: string;
  dependsOn?: string | string[];
  /** Written to this field when a parent changes. `''` for a single select,
   *  `[]` for a multi, `undefined` for a number. */
  emptyValue?: unknown;
};

type Result = {
  parentValue: string | undefined;
  parentValues: Record<string, string | undefined>;
  dependsOnList: string[];
  /** True while any listed parent is still empty. */
  gated: boolean;
};

/** Watches the parent fields and clears this one whenever any of them changes.
 *
 *  The reset compares previous parent values rather than tracking a "have I run
 *  before" flag: StrictMode invokes mount effects twice and a ref survives that
 *  simulated remount, so a boolean reads as already spent on the second run and
 *  wipes edit-mode defaults. Comparing values makes the extra run a no-op. */
export function useCascade({ name, dependsOn, emptyValue = '' }: Options): Result {
  const form = useFormContext();
  const dependsOnList = normalizeDependsOn(dependsOn);

  const watched = useWatch({
    control: form.control,
    name: watchNames(dependsOnList),
  }) as unknown[];

  const previousParents = useRef<unknown[]>(watched);
  // `watched` is a fresh array every render, so the effect keys off its contents.
  const watchKey = JSON.stringify(watched);

  useEffect(() => {
    if (!dependsOnList.length) return;

    const changed = watched.some((value, index) => !Object.is(previousParents.current[index], value));
    if (!changed) return;

    previousParents.current = watched;
    form.setValue(name, emptyValue, { shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchKey]);

  const parentValues: Record<string, string | undefined> = {};
  dependsOnList.forEach((parentName, index) => {
    parentValues[parentName] = watched[index] as string | undefined;
  });

  return {
    parentValue: dependsOnList.length ? (watched[0] as string | undefined) : undefined,
    parentValues,
    dependsOnList,
    gated: dependsOnList.length > 0 && watched.some(isEmptyParent),
  };
}
