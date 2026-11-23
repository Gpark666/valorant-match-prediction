// frontend/app/index.tsx
import { Link } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import type { MatchSegment, MatchQuery } from '../types/api';
import { useMatchList } from '../hooks/useMatchList';

const TAB_LABELS: { key: MatchQuery; label: string }[] = [
  { key: 'live_score', label: '진행중' },
  { key: 'results', label: '결과' },
  { key: 'upcoming', label: '진행 예정' },
];

export default function IndexScreen() {
  const [currentTab, setCurrentTab] = useState<MatchQuery>('live_score');
  const { segments, loading, error } = useMatchList(currentTab);

  console.log('MATCH_LIST_STATE', {
    tab: currentTab,
    loading,
    error,
    count: segments.length,
  });

  const renderItem = ({ item }: { item: MatchSegment }) => {
    const idMatch = item.match_page.match(/\d+/);
    const matchId = idMatch ? idMatch[0] : item.match_page;

    return (
      <Link
        // pathname은 고정 문자열로, 실제 id는 params로만 넘긴다
        href={{
          pathname: '/match/[match_id]',
          params: {
            match_id: matchId,
            match_page: item.match_page,
          },
        }}
        asChild
      >
        <TouchableOpacity
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {item.tournament_icon ? (
            <Image
              source={{ uri: item.tournament_icon }}
              style={{ width: 32, height: 32, marginRight: 8 }}
            />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {item.team1} vs {item.team2}
            </Text>
            <Text>
              {item.tournament_name ?? item.match_event ?? ''}{' '}
              {item.round_info ? `· ${item.round_info}` : ''}
            </Text>
            {(item.score1 ||
              item.score2 ||
              item.team1_score ||
              item.team2_score) && (
              <Text>
                Score: {item.score1 ?? item.team1_score ?? '-'} :{' '}
                {item.score2 ?? item.team2_score ?? '-'}
              </Text>
            )}
            {currentTab === 'upcoming' && item.time_until_match && (
              <Text>시작까지: {item.time_until_match}</Text>
            )}
            {currentTab === 'results' && item.time_completed && (
              <Text>종료: {item.time_completed}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const renderTabs = () => (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      }}
    >
      {TAB_LABELS.map((tab) => {
        const active = currentTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => setCurrentTab(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderBottomWidth: 2,
              borderBottomColor: active ? '#007aff' : 'transparent',
            }}
          >
            <Text style={{ color: active ? '#007aff' : '#666' }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {renderTabs()}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {renderTabs()}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderTabs()}
      <FlatList
        data={segments}
        keyExtractor={(item, idx) => `${item.match_page}-${idx}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>경기가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
