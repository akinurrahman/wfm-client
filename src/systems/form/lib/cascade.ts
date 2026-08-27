import { NO_PARENT } from '../constants';

export function normalizeDependsOn(dependsOn?: string | string[]): string[] {
  if (!dependsOn) return [];
  return Array.isArray(dependsOn) ? dependsOn : [dependsOn];
}

/** A parent counts as empty, so the child stays gated, when it holds no
 *  meaningful value. */
export function isEmptyParent(value: unknown): boolean {
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || value === '';
}

export function watchNames(dependsOnList: string[]): string[] {
  return dependsOnList.length ? dependsOnList : [NO_PARENT];
}

/** Names the parent that is missing, rather than leaving a disabled control with
 *  no explanation for why it will not open. */
export function gatedText(dependsOnList: string[]): string {
  return `Select ${dependsOnList.join(', ')} first`;
}
