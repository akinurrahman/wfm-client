import { useState } from 'react';

/** Hover and keyboard reading for a banded chart: the columns are a few pixels
 *  wide at a long window, so the index is read off the plot's whole width and a
 *  pointer between two columns still means the nearer one. */
export function useChartHover(count: number) {
  const [active, setActive] = useState<number | null>(null);

  const readIndex = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(Math.max(Math.floor(ratio * count), 0), count - 1);
  };

  const step = (delta: number) =>
    setActive(current => {
      const next = (current ?? count - 1) + delta;
      return Math.min(Math.max(next, 0), count - 1);
    });

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'ArrowLeft') step(-1);
    else if (event.key === 'Home') setActive(0);
    else if (event.key === 'End') setActive(count - 1);
    else if (event.key === 'Escape') setActive(null);
    else return;

    event.preventDefault();
  };

  return {
    active,
    /** Centre of the active band, which the crosshair and the tooltip both hang
     *  off so they cannot drift apart. */
    anchor: active === null ? 0 : ((active + 0.5) / count) * 100,
    /** Spread onto the element that wraps the plot. One tab stop, not one per
     *  column, with the arrow keys walking the series. */
    bindings: {
      tabIndex: 0,
      onPointerMove: (event: React.PointerEvent<HTMLElement>) =>
        setActive(readIndex(event.clientX, event.currentTarget)),
      onPointerDown: (event: React.PointerEvent<HTMLElement>) =>
        setActive(readIndex(event.clientX, event.currentTarget)),
      onPointerLeave: () => setActive(null),
      onBlur: () => setActive(null),
      onKeyDown,
    },
  };
}
