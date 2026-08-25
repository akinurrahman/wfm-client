import { defineUrlFilters } from '@/systems/filters';

/** Not a `createLookup`: these are screen sections rather than an API enum, so
 *  nothing resolves them to a badge and nothing validates against them on the
 *  wire. The tab still travels in the URL, so a section can be linked to. */
const SECTION_TABS = [
  { value: 'family', label: 'Family' },
  { value: 'identity', label: 'Government IDs' },
  { value: 'bank', label: 'Bank' },
  { value: 'education', label: 'Education' },
  { value: 'certificates', label: 'Certificates' },
  { value: 'employment', label: 'Employment history' },
] as const;

/** The view and the editor carry the same sections, so a tab keeps its meaning
 *  when someone moves between reading a record and changing it. Only the first
 *  tab differs: reading opens on the summary, editing on the core record. */
export const VIEW_TABS = [{ value: 'overview', label: 'Overview' }, ...SECTION_TABS] as const;

export const EDIT_TABS = [{ value: 'details', label: 'Details' }, ...SECTION_TABS] as const;

export type ViewTab = (typeof VIEW_TABS)[number]['value'];
export type EditTab = (typeof EDIT_TABS)[number]['value'];

export const VIEW_TAB_SPEC = defineUrlFilters<{ tab: ViewTab }>({
  tab: {
    values: VIEW_TABS.map(item => item.value),
    defaultValue: 'overview',
    // A view preference, not a filter, so it never lights up "Clear filters".
    view: true,
  },
});

export const EDIT_TAB_SPEC = defineUrlFilters<{ tab: EditTab }>({
  tab: {
    values: EDIT_TABS.map(item => item.value),
    defaultValue: 'details',
    view: true,
  },
});

export const AADHAR_LENGTH = 12;
export const PAN_LENGTH = 10;
export const IFSC_LENGTH = 11;
