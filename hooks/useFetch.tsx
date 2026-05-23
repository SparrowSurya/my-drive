"use client";

import { useCallback, useEffect, useState, useRef } from "react";

type UseFetchOptions = RequestInit & {
  immediate?: boolean;
};

type UseFetchReturn<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: (newUrl?: string) => Promise<T | undefined>;
};

export function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchReturn<T> {
  const { immediate = true, ...fetchOptions } = options || {};

  const optionsRef = useRef(fetchOptions);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(immediate);

  const fetchData = useCallback(async (newUrl?: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(newUrl ?? url, optionsRef.current);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();
      setData(json);
      return json as T;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      return undefined;
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
