import { RefObject, useEffect } from 'react';

type LayoutCallback = (rect: DOMRect | null) => void;

export const useOnLayout = (
  ref: RefObject<HTMLElement | null>,
  callback: LayoutCallback,
) => {
  useEffect(() => {
    if (!ref.current) return;

    const measure = () => {
      const rect = ref.current?.getBoundingClientRect() ?? null;
      callback(rect);
    };

    // Initial measure after mount
    requestAnimationFrame(measure);

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
};
