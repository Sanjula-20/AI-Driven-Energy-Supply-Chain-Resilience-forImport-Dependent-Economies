import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';

/**
 * Fetches `url` on mount (and whenever deps change), exposing
 * { data, loading, error, refetch }. Kept deliberately simple for V1 -
 * pages call this instead of duplicating axios + useState boilerplate.
 */
export default function useApiData(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    client
      .get(url)
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tick, ...deps]);

  return { data, loading, error, refetch };
}
