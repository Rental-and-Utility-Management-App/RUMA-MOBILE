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
import { paymentStatusLabel, roomStatusLabel } from '../utils/i18n';
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
    Alert.alert('Trả phòng', `Đánh dấu phòng ${room?.code} đã trả?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Trả phòng', style: 'destructive', onPress: async () => {
        setBusy(true);
        try { await roomsApi.checkoutRoom(params.id); await load(); }
        catch (e: any) { Alert.alert('Thất bại', e.message); }
        finally { setBusy(false); }
      }},
    ]);
  }

  if (loading) return <LoadingState label="Đang tải thông tin phòng…" />;
  if (error || !room) return <ErrorState message={error || 'Không tìm thấy phòng'} onRetry={load} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[text.displayM, { color: theme.fg1 }]}>{room.code}{room.name ? ` · ${room.name}` : ''}</Text>
        <Badge label={roomStatusLabel(room.status)} tone={room.status === 'occupied' ? 'brand' : 'neutral'} />
      </View>

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>BẢNG GIÁ</Text>
        <Row label="Tiền thuê hàng tháng" value={formatVND(room.monthly_rent)} />
        <Row label="Tiền điện" value={`${formatVND(room.price_electricity)} / kWh`} />
        <Row label="Tiền nước" value={`${formatVND(room.price_water)} / m³`} />
        <Row label="Phí quản lý" value={`${formatVND(room.management_fee_per_person)} / người`} />
      </MobileCard>

      {room.current_month_payment ? (
        <MobileCard style={{ gap: space[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[text.labelS, { color: theme.fg3 }]}>THÁNG NÀY</Text>
            <Badge label={paymentStatusLabel(room.current_month_payment.status)} tone={roomPaymentTone(room.current_month_payment.status)} />
          </View>
          {room.current_month_payment.total_amount ? <Row label="Tổng cộng" value={formatVND(room.current_month_payment.total_amount)} /> : null}
          {room.current_month_payment.paid_amount ? <Row label="Đã thanh toán" value={formatVND(room.current_month_payment.paid_amount)} /> : null}
        </MobileCard>
      ) : null}

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>NGƯỜI THUÊ ({room.occupants}/{room.capacity || '∞'})</Text>
        {room.tenants?.length ? room.tenants.map((t) => (
          <Row key={t.id} label={t.full_name} value={t.phone} />
        )) : <Text style={[text.bodyS, { color: theme.fg3 }]}>Chưa có người thuê</Text>}
      </MobileCard>

      {user?.role === 'manager' && room.status === 'occupied' ? (
        <MobileButton title="Trả phòng" variant="danger" onPress={onCheckout} loading={busy} />
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
