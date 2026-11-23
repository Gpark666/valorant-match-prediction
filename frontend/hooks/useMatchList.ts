// frontend/hooks/useMatchList.ts
import { useEffect, useState } from 'react';
import type { MatchSegment, MatchListResponse, MatchQuery } from '../types/api';

export function useMatchList(q: MatchQuery) {
  const [data, setData] = useState<MatchListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `http://127.0.0.1:8001/match?q=${q}`;
        console.log('FETCH_MATCHES_URL', url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = (await res.json()) as MatchListResponse;
        console.log('MATCH_LIST_API_RESPONSE', json);

        setData(json);
      } catch (e: any) {
        console.error('MATCH_LIST_API_ERROR', e);
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [q]);

  const segments: MatchSegment[] = data?.data?.segments ?? [];

  return { data, segments, loading, error };
}
