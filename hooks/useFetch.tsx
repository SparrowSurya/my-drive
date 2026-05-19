"use client";

import { useCallback, useEffect, useState, useRef } from "react";

type UseFetchOptions = RequestInit & {
  immediate?: boolean;
};

type UseFetchReturn<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

export function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchReturn<T> {
  const { immediate = true, ...fetchOptions } = options || {};

  const optionsRef = useRef(fetchOptions);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(immediate);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, optionsRef.current);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!immediate) return;

    fetchData();
  }, [fetchData, immediate]);

  return { data, error, loading, refetch: fetchData };
}
