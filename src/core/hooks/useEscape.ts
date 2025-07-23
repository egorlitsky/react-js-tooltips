import { useEffect } from "react";

const KEY_NAME_ESC = "Escape";
const KEY_EVENT_TYPE = "keyup";

export const useEscape = (cb: () => void, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === KEY_NAME_ESC) {
        cb();
      }
    };

    document.addEventListener(KEY_EVENT_TYPE, handleEscape, false);

    return () => {
      document.removeEventListener(KEY_EVENT_TYPE, handleEscape, false);
    };
  }, [cb, enabled]);
};
