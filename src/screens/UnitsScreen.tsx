import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, text, space, radius } from '../theme/tokens';
import { MobileBadge as Badge, roomPaymentTone } from '../components/MobileBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import * as roomsApi from '../api/rooms';
import { Room } from '../api/types';
import { formatVND } from '../utils/format';
import { paymentStatusLabel, roomStatusLabel } from '../utils/i18n';

export default function UnitsScreen() {
  const navigation = useNavigation<any>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setRooms(await roomsApi.listRooms()); } catch (e: any) { setError(e.message); }
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);
  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  if (loading) return <LoadingState label="Đang tải danh sách phòng…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.bgPage }}
      contentContainerStyle={{ padding: space[5], gap: space[3] }}
      data={rooms}
      keyExtractor={(r) => r.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.brandPrimary} />}
      ItemSeparatorComponent={() => <View style={{ height: space[3] }} />}
      ListEmptyComponent={<EmptyState title="Chưa có phòng nào" />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('UnitDetail', { id: item.id })}
          style={({ pressed }) => ({
            backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle, opacity: pressed ? 0.85 : 1,
          })}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ gap: 2 }}>
              <Text style={[text.labelM, { color: theme.fg1 }]}>{item.code}{item.name ? ` · ${item.name}` : ''}</Text>
              <Text style={[text.bodyS, { color: theme.fg2 }]}>{formatVND(item.monthly_rent)} / tháng · {item.occupants}/{item.capacity || '∞'} người ở</Text>
            </View>
            <Badge
              label={item.current_month_payment ? paymentStatusLabel(item.current_month_payment.status) : roomStatusLabel(item.status)}
              tone={item.current_month_payment ? roomPaymentTone(item.current_month_payment.status) : item.status === 'occupied' ? 'brand' : 'neutral'}
            />
          </View>
        </Pressable>
      )}
    />
  );
}
