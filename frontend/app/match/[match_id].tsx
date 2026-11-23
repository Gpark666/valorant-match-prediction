// frontend/app/match/[match_id].tsx
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMatchDetail } from '../../hooks/useMatchDetail';
import type { RoundInfo } from '../../types/api';

export default function MatchDetailScreen() {
  // /match/[match_id]?match_page=/591447/... 구조
  const params = useLocalSearchParams<{ match_id: string; match_page?: string }>();

  const matchId = params.match_id ?? null;
  const matchPageParam = (params.match_page as string | undefined) ?? null;

  // 백엔드로 넘길 진짜 match_page (없으면 id로 대충 조합)
  const fullMatchPage =
    matchPageParam ?? (matchId ? `/${matchId}` : null);

  const { data, loading, error } = useMatchDetail(fullMatchPage);

  console.log('MATCH_DETAIL_STATE', {
    matchId,
    matchPageParam,
    fullMatchPage,
    loading,
    error,
    hasData: !!data,
  });

  if (!fullMatchPage) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>잘못된 매치 주소입니다.</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Error: {error ?? 'No data'}</Text>
      </SafeAreaView>
    );
  }

  const { rounds, next_round_prob } = data;

  const renderRound = ({ item }: { item: RoundInfo }) => {
    const winnerText =
      item.winner === 'team1'
        ? 'Team 1'
        : item.winner === 'team2'
        ? 'Team 2'
        : 'None';

    return (
      <View style={styles.roundRow}>
        <Text style={styles.roundNum}>R{item.round_number}</Text>
        <Text style={styles.roundScore}>
          {item.score_t1} : {item.score_t2}
        </Text>
        <Text style={styles.roundWinner}>Winner: {winnerText}</Text>
      </View>
    );
  };

  const probText =
    next_round_prob != null
      ? `${(next_round_prob * 100).toFixed(1)} %`
      : '예측 불가';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match Detail</Text>
        <Text style={styles.headerSub}>
          {fullMatchPage}
        </Text>
      </View>

      <View style={styles.probBox}>
        <Text style={styles.probLabel}>다음 라운드 Team1 승리 확률</Text>
        <Text style={styles.probValue}>{probText}</Text>
      </View>

      <FlatList
        data={rounds}
        keyExtractor={(item) => `round-${item.round_number}`}
        renderItem={renderRound}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  probBox: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
  },
  probLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  probValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roundNum: {
    width: 50,
    fontWeight: 'bold',
  },
  roundScore: {
    width: 80,
  },
  roundWinner: {
    flex: 1,
  },
});
