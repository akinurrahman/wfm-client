import { createContext } from 'react';

/**
 * The empty left half of the app header on a section's landing page, where no
 * breadcrumb trail is competing for it. When the layout offers one, PageHeader
 * renders itself up there instead of under the bar, so the page starts at the
 * top of the sheet rather than below an empty band.
 *
 * Its own file because a context is neither a component nor a hook, and fast
 * refresh wants component modules to export only components.
 */
export const PageTitleSlotContext = createContext<HTMLElement | null>(null);
