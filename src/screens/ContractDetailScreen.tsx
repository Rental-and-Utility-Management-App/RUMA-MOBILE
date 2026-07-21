import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { theme, text, space } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge as Badge, contractTone } from '../components/MobileBadge';
import { MobileButton } from '../components/MobileButton';
import { Avatar } from '../components/Avatar';
import { LoadingState, ErrorState } from '../components/States';
import * as contractsApi from '../api/contracts';
import * as roomsApi from '../api/rooms';
import * as invoicesApi from '../api/invoices';
import { Contract, Room } from '../api/types';
import { formatVND, formatDate } from '../utils/format';
import { contractStatusLabel, depositStatusLabel } from '../utils/i18n';

export default function ContractDetailScreen() {
  const { params } = useRoute<any>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setQr(null);
    setQrError(null);
    try {
      const c = await contractsApi.getContract(params.id);
      setContract(c);
      setRoom(await roomsApi.getRoom(c.room_id));
    } catch (e: any) { setError(e.message); }
  }, [params.id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const invoiceId = room?.current_month_payment?.invoice_id;

  async function onLoadQr() {
    if (!invoiceId) return;
    setQrError(null);
    setQrLoading(true);
    try {
      const res = await invoicesApi.getInvoiceQRCode(invoiceId);
      const raw = res.qr_code_url;
      if (!raw) { setQrError('Không tạo được mã QR.'); return; }
      setQr(raw.startsWith('http') || raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`);
    } catch (e: any) {
      setQrError(e?.message || 'Không tạo được mã QR.');
    } finally {
      setQrLoading(false);
    }
  }

  if (loading) return <LoadingState label="Đang tải hợp đồng…" />;
  if (error || !contract) return <ErrorState message={error || 'Không tìm thấy hợp đồng'} onRetry={load} />;

  const paymentStatus = room?.current_month_payment?.status;
  const canPay = !!invoiceId && paymentStatus !== 'paid' && paymentStatus !== 'no_invoice';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[text.displayM, { color: theme.fg1 }]}>Phòng {contract.room_code || contract.room_id}</Text>
        <Badge label={contractStatusLabel(contract.status)} tone={contractTone(contract.status)} />
      </View>

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>THỜI HẠN</Text>
        <Row label="Bắt đầu" value={formatDate(contract.start_date)} />
        <Row label="Kết thúc" value={formatDate(contract.end_date)} />
        {contract.actual_end_date ? <Row label="Ngày kết thúc thực tế" value={formatDate(contract.actual_end_date)} /> : null}
      </MobileCard>

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>TÀI CHÍNH</Text>
        <Row label="Tiền thuê hàng tháng" value={formatVND(contract.monthly_rent)} />
        <Row label="Tiền cọc" value={`${formatVND(contract.deposit_paid)} / ${formatVND(contract.deposit_amount)}`} />
        {contract.deposit_refunded ? <Row label="Đã hoàn cọc" value={formatVND(contract.deposit_refunded)} /> : null}
        <Row label="Trạng thái cọc" value={depositStatusLabel(contract.deposit_status)} />
      </MobileCard>

      {canPay ? (
        <MobileCard style={{ alignItems: 'center', gap: space[3] }}>
          {qr ? (
            <>
              <Text style={[text.labelS, { color: theme.fg3 }]}>QUÉT MÃ ĐỂ THANH TOÁN TIỀN PHÒNG</Text>
              <Image source={{ uri: qr }} style={{ width: 200, height: 200, borderRadius: 8 }} resizeMode="contain" />
              {room?.current_month_payment?.total_amount ? (
                <Text style={[text.bodyS, { color: theme.fg2 }]}>{formatVND(room.current_month_payment.total_amount)}</Text>
              ) : null}
            </>
          ) : (
            <>
              <MobileButton title="Quét mã thanh toán (VietQR)" variant="secondary" onPress={onLoadQr} loading={qrLoading} />
              {qrError ? <Text style={[text.bodyS, { color: theme.danger, textAlign: 'center' }]}>{qrError}</Text> : null}
            </>
          )}
        </MobileCard>
      ) : null}

      <MobileCard style={{ gap: space[4] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>NGƯỜI THUÊ</Text>
        {contract.tenants?.length ? contract.tenants.map((t) => (
          <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space[3] }}>
            <Avatar name={t.full_name} size={44} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[text.labelM, { color: theme.fg1 }]}>{t.full_name}</Text>
              <Text style={[text.bodyS, { color: theme.fg2 }]}>{t.phone}</Text>
            </View>
          </View>
        )) : <Text style={[text.bodyS, { color: theme.fg3 }]}>Chưa có người thuê</Text>}
      </MobileCard>

      {contract.note ? (
        <MobileCard style={{ gap: space[2] }}>
          <Text style={[text.labelS, { color: theme.fg3 }]}>GHI CHÚ</Text>
          <Text style={[text.bodyS, { color: theme.fg2 }]}>{contract.note}</Text>
        </MobileCard>
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
