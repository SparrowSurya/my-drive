import { useRef, useCallback } from "react";


export default function useDebounce(func: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      func();
      timeoutRef.current = null;
    }, delay);
  }, [func, delay]);

  return { refresh, cancel };
}
