import { useEffect } from 'react';

import { useCommandPaletteStore } from '../store';

export const isMacPlatform = () =>
  typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.userAgent);

/** Binds ⌘K / Ctrl+K to the palette. Mount once, at the app shell. */
export function useCommandHotkey() {
  const togglePalette = useCommandPaletteStore(store => store.togglePalette);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k') return;
      if (!event.metaKey && !event.ctrlKey) return;

      event.preventDefault();
      togglePalette();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [togglePalette]);
}
