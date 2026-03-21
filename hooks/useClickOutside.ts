"use client";

import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent;

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
  active = true
) => {
  useEffect(() => {
    if (!active) return;

    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [active, handler, ref]);
};

export default useClickOutside;
