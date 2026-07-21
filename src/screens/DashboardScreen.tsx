import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { theme, text, space } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge as Badge, roomPaymentTone } from '../components/MobileBadge';
import { LoadingState, ErrorState } from '../components/States';
import { useAuth } from '../context/AuthContext';
import * as reportsApi from '../api/reports';
import * as roomsApi from '../api/rooms';
import { ReportSummary, Room } from '../api/types';
import { formatVND } from '../utils/format';

export default function DashboardScreen() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      if (isManager) setSummary(await reportsApi.getSummary());
      else if (user?.room_id) setRoom(await roomsApi.getRoom(user.room_id));
    } catch (e: any) { setError(e.message); }
  }, [isManager, user?.room_id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  if (loading) return <LoadingState label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bgPage }}
      contentContainerStyle={{ padding: space[5], gap: space[4] }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.brandPrimary} />}
    >
      <View style={{ gap: 2 }}>
        <Text style={[text.bodyM, { color: theme.fg2 }]}>Welcome back,</Text>
        <Text style={[text.displayM, { color: theme.fg1 }]}>{user?.full_name}</Text>
      </View>

      {isManager ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[3] }}>
          <StatCard label="Occupied rooms" value={String(summary?.occupied_rooms ?? '—')} />
          <StatCard label="Available rooms" value={String(summary?.available_rooms ?? '—')} />
          <StatCard label="Revenue this month" value={formatVND(summary?.monthly_revenue as number)} wide />
          <StatCard label="Outstanding" value={formatVND(summary?.outstanding_amount as number)} wide tone="danger" />
        </View>
      ) : room ? (
        <MobileCard style={{ gap: space[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={[text.labelS, { color: theme.fg3 }]}>YOUR ROOM</Text>
              <Text style={[text.displayS, { color: theme.fg1 }]}>{room.code}{room.name ? ` · ${room.name}` : ''}</Text>
            </View>
            {room.current_month_payment ? (
              <MobileBadge label={room.current_month_payment.status.replace('_', ' ')} tone={roomPaymentTone(room.current_month_payment.status)} />
            ) : null}
          </View>
          <Row label="Monthly rent" value={formatVND(room.monthly_rent)} />
          <Row label="Occupants" value={`${room.occupants} / ${room.capacity || '∞'}`} />
          {room.current_month_payment?.total_amount ? (
            <Row label="This month's bill" value={formatVND(room.current_month_payment.total_amount)} />
          ) : null}
        </MobileCard>
      ) : (
        <MobileCard><Text style={[text.bodyM, { color: theme.fg2 }]}>No room assigned yet.</Text></MobileCard>
      )}
    </ScrollView>
  );
}

function StatCard({ label, value, wide, tone }: { label: string; value: string; wide?: boolean; tone?: 'danger' }) {
  return (
    <MobileCard style={{ flexBasis: wide ? '100%' : '47%', flexGrow: 1, gap: space[1] }}>
      <Text style={[text.labelS, { color: theme.fg3 }]}>{label.toUpperCase()}</Text>
      <Text style={[text.displayS, { color: tone === 'danger' ? theme.danger : theme.fg1 }]}>{value}</Text>
    </MobileCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={[text.bodyS, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[text.bodyS, { color: theme.fg1 }]}>{value}</Text>
    </View>
  );
}
