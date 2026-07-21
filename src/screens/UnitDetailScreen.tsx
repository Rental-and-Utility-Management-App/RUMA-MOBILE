import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme, text, space } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge as Badge, roomPaymentTone } from '../components/MobileBadge';
import { MobileButton } from '../components/MobileButton';
import { LoadingState, ErrorState } from '../components/States';
import * as roomsApi from '../api/rooms';
import { Room } from '../api/types';
import { formatVND } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export default function UnitDetailScreen() {
  const { params } = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try { setRoom(await roomsApi.getRoom(params.id)); } catch (e: any) { setError(e.message); }
  }, [params.id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  async function onCheckout() {
    Alert.alert('Checkout room', `Mark ${room?.code} as vacated?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Checkout', style: 'destructive', onPress: async () => {
        setBusy(true);
        try { await roomsApi.checkoutRoom(params.id); await load(); }
        catch (e: any) { Alert.alert('Failed', e.message); }
        finally { setBusy(false); }
      }},
    ]);
  }

  if (loading) return <LoadingState label="Loading unit…" />;
  if (error || !room) return <ErrorState message={error || 'Not found'} onRetry={load} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[text.displayM, { color: theme.fg1 }]}>{room.code}{room.name ? ` · ${room.name}` : ''}</Text>
        <Badge label={room.status} tone={room.status === 'occupied' ? 'brand' : 'neutral'} />
      </View>

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>PRICING</Text>
        <Row label="Monthly rent" value={formatVND(room.monthly_rent)} />
        <Row label="Electricity" value={`${formatVND(room.price_electricity)} / kWh`} />
        <Row label="Water" value={`${formatVND(room.price_water)} / m³`} />
        <Row label="Management fee" value={`${formatVND(room.management_fee_per_person)} / person`} />
      </MobileCard>

      {room.current_month_payment ? (
        <MobileCard style={{ gap: space[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[text.labelS, { color: theme.fg3 }]}>THIS MONTH</Text>
            <Badge label={room.current_month_payment.status.replace('_', ' ')} tone={roomPaymentTone(room.current_month_payment.status)} />
          </View>
          {room.current_month_payment.total_amount ? <Row label="Total" value={formatVND(room.current_month_payment.total_amount)} /> : null}
          {room.current_month_payment.paid_amount ? <Row label="Paid" value={formatVND(room.current_month_payment.paid_amount)} /> : null}
        </MobileCard>
      ) : null}

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>TENANTS ({room.occupants}/{room.capacity || '∞'})</Text>
        {room.tenants?.length ? room.tenants.map((t) => (
          <Row key={t.id} label={t.full_name} value={t.phone} />
        )) : <Text style={[text.bodyS, { color: theme.fg3 }]}>No tenants assigned</Text>}
      </MobileCard>

      {user?.role === 'manager' && room.status === 'occupied' ? (
        <MobileButton title="Checkout room" variant="danger" onPress={onCheckout} loading={busy} />
      ) : null}
    </ScrollView>
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
