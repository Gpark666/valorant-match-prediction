// frontend/hooks/useMatchDetail.ts
import { useEffect, useState } from 'react';
import type { MatchDetailResponse } from '../types/api';

interface UseMatchDetailResult {
  data: MatchDetailResponse | null;
  loading: boolean;
  error: string | null;
}

/**
 * matchPage: 백엔드에 넘길 전체 match_page (예: "/591447/gig-vs-...")
 */
export function useMatchDetail(matchPage: string | null): UseMatchDetailResult {
  const [data, setData] = useState<MatchDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(!!matchPage);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchPage) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const encoded = encodeURIComponent(matchPage);
        const url = `http://127.0.0.1:8001/match/detail?match_page=${encoded}`;
        console.log('MATCH_DETAIL_URL', url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = (await res.json()) as MatchDetailResponse;
        console.log('MATCH_DETAIL_RESPONSE', json);

        setData(json);
      } catch (e: any) {
        console.error('MATCH_DETAIL_ERROR', e);
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [matchPage]);

  return { data, loading, error };
}
