import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, text, space, radius } from '../theme/tokens';
import { MobileBadge as Badge, invoiceTone } from '../components/MobileBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import * as invoicesApi from '../api/invoices';
import { Invoice } from '../api/types';
import { formatVND, monthLabel } from '../utils/format';

const FILTERS = ['all', 'unpaid', 'partial', 'paid'] as const;

export default function BillingScreen() {
  const navigation = useNavigation<any>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setInvoices(await invoicesApi.listInvoices(filter === 'all' ? undefined : { status: filter })); }
    catch (e: any) { setError(e.message); }
  }, [filter]);

  useEffect(() => { setLoading(true); load().finally(() => setLoading(false)); }, [load]);
  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bgPage }}>
      <View style={{ flexDirection: 'row', gap: space[2], padding: space[5], paddingBottom: 0 }}>
        {FILTERS.map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={{
            paddingHorizontal: space[4], paddingVertical: space[2], borderRadius: radius.pill,
            backgroundColor: filter === f ? theme.brandPrimary : theme.bgSurface,
            borderWidth: 1, borderColor: filter === f ? theme.brandPrimary : theme.borderDefault,
          }}>
            <Text style={[text.labelS, { color: filter === f ? theme.fgOnDark : theme.fg2, textTransform: 'capitalize' }]}>{f}</Text>
          </Pressable>
        ))}
      </View>
      {loading ? <LoadingState label="Loading invoices…" /> : error ? <ErrorState message={error} onRetry={load} /> : (
        <FlatList
          contentContainerStyle={{ padding: space[5], gap: space[3] }}
          data={invoices}
          keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.brandPrimary} />}
          ItemSeparatorComponent={() => <View style={{ height: space[3] }} />}
          ListEmptyComponent={<EmptyState title="No invoices" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('InvoiceDetail', { id: item.id })}
              style={({ pressed }) => ({
                backgroundColor: theme.bgSurface, borderRadius: radius.l, padding: space[4], borderWidth: 1, borderColor: theme.borderSubtle, opacity: pressed ? 0.85 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ gap: 2 }}>
                  <Text style={[text.labelM, { color: theme.fg1 }]}>{monthLabel(item.month, item.year)}</Text>
                  <Text style={[text.bodyS, { color: theme.fg2 }]}>{formatVND(item.total_amount)}{item.overdue ? ' · overdue' : ''}</Text>
                </View>
                <MobileBadge label={item.status} tone={invoiceTone(item.status)} />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
