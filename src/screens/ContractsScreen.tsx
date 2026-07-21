import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { theme, text, space, radius } from '../theme/tokens';
import { MobileBadge as Badge, contractTone } from '../components/MobileBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import * as contractsApi from '../api/contracts';
import { Contract } from '../api/types';
import { formatVND, formatDate } from '../utils/format';
import { contractStatusLabel } from '../utils/i18n';

export default function ContractsScreen() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setContracts(await contractsApi.listContracts()); } catch (e: any) { setError(e.message); }
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);
  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  if (loading) return <LoadingState label="Đang tải hợp đồng…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.bgPage }}
      contentContainerStyle={{ padding: space[5], gap: space[3] }}
      data={contracts}
      keyExtractor={(c) => c.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.brandPrimary} />}
      ItemSeparatorComponent={() => <View style={{ height: space[3] }} />}
      ListEmptyComponent={<EmptyState title="Chưa có hợp đồng nào" />}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle, gap: space[2] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[text.labelM, { color: theme.fg1 }]}>{item.room_code || item.room_id}</Text>
            <Badge label={contractStatusLabel(item.status)} tone={contractTone(item.status)} />
          </View>
          <Text style={[text.bodyS, { color: theme.fg2 }]}>{formatDate(item.start_date)} – {formatDate(item.end_date)}</Text>
          <Text style={[text.bodyS, { color: theme.fg2 }]}>{item.tenants?.map((t) => t.full_name).join(', ') || 'Chưa có người thuê'}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[text.bodyS, { color: theme.fg3 }]}>Tiền thuê {formatVND(item.monthly_rent)}</Text>
            <Text style={[text.bodyS, { color: theme.fg3 }]}>Cọc {formatVND(item.deposit_paid)}/{formatVND(item.deposit_amount)}</Text>
          </View>
        </View>
      )}
    />
  );
}
