import * as React from "react"

const MOBILE_BREAKPOINT = 768

const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onChange)

  return () => mql.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches

/** Read during render rather than settled by an effect afterwards: a layout
 *  that branches on this would otherwise paint the desktop arrangement once
 *  and correct itself a frame later. */
export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot)
}
