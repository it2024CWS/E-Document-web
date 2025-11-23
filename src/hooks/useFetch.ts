import { useState, useEffect, useRef } from 'react';

function useFetch<T>(fetchFunction: () => Promise<T>, shouldFetch: boolean = true, defaultValue: T = null!, dependencies: unknown[] = []) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const fetchFunctionRef = useRef(fetchFunction);

  // Keep fetch function reference updated
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunctionRef.current();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shouldFetch) {
      setData(defaultValue); // Reset data if `shouldFetch` is false
      return;
    }

    fetchData(); // Fetch on mount and when dependencies change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch, ...dependencies]);

  // Manual refetch function
  const refetch = async () => {
    if (!shouldFetch) return;
    await fetchData();
  };

  return [data, loading, error, refetch] as const;
}

export default useFetch;
