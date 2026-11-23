// frontend/types/api.ts

export type MatchQuery = 'upcoming' | 'live_score' | 'results';

export interface MatchSegment {
  team1: string;
  team2: string;
  flag1?: string | null;
  flag2?: string | null;

  score1?: string | null;
  score2?: string | null;
  team1_score?: string | null;
  team2_score?: string | null;

  current_map?: string | null;
  map_number?: string | null;

  time_until_match?: string | null;
  time_completed?: string | null;

  round_info?: string | null;
  tournament_name?: string | null;
  match_event?: string | null;
  match_series?: string | null;
  unix_timestamp?: number | null;

  match_page: string;           // ex) "/591447/gig-vs-..."
  tournament_icon?: string | null;
  page_number?: number | null;
}

/**
 * 백엔드 /match 응답
 */
export interface MatchListData {
  status: number;
  segments: MatchSegment[];
}

export interface MatchListResponse {
  data: MatchListData;
}

/**
 * 디테일용 타입
 */
export type RoundWinner = 'team1' | 'team2' | 'none';

export interface RoundInfo {
  map_name: string;
  round_number: number;
  score_t1: number;
  score_t2: number;
  winner: RoundWinner;
  phase: string | null;
}

export interface MatchDetailResponse {
  match_page: string;
  rounds: RoundInfo[];
  next_round_prob: number | null;
}
