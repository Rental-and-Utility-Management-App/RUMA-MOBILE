import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { theme, text, space } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge as Badge, invoiceTone } from '../components/MobileBadge';
import { MobileButton } from '../components/MobileButton';
import { LoadingState, ErrorState } from '../components/States';
import * as invoicesApi from '../api/invoices';
import * as paymentsApi from '../api/payments';
import { Invoice, Payment } from '../api/types';
import { formatVND, formatDate, monthLabel } from '../utils/format';
import { invoiceStatusLabel, paymentMethodLabel } from '../utils/i18n';

export default function InvoiceDetailScreen() {
  const { params } = useRoute<any>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [qr, setQr] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const inv = await invoicesApi.getInvoice(params.id);
      setInvoice(inv);
      setPayments((await paymentsApi.listPayments({ invoice_id: params.id })) || []);
    } catch (e: any) { setError(e.message); }
  }, [params.id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  async function onLoadQr() {
    setQrError(null);
    setQrLoading(true);
    try {
      const res = await invoicesApi.getInvoiceQRCode(params.id);
      const raw = res.qr_code_url;
      if (!raw) { setQrError('Không tạo được mã QR.'); return; }
      setQr(raw.startsWith('http') || raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`);
    } catch (e: any) {
      setQrError(e?.message || 'Không tạo được mã QR.');
    } finally {
      setQrLoading(false);
    }
  }

  if (loading) return <LoadingState label="Đang tải hóa đơn…" />;
  if (error || !invoice) return <ErrorState message={error || 'Không tìm thấy hóa đơn'} onRetry={load} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[text.displayM, { color: theme.fg1 }]}>{monthLabel(invoice.month, invoice.year)}</Text>
        <Badge label={invoiceStatusLabel(invoice.status)} tone={invoiceTone(invoice.status)} />
      </View>

      <MobileCard style={{ gap: space[3] }}>
        <Row label="Tiền phòng" value={formatVND(invoice.rent_amount)} />
        <Row label={`Tiền điện (${invoice.electric_new - invoice.electric_old} kWh)`} value={formatVND(invoice.electric_amount)} />
        <Row label={`Tiền nước (${invoice.water_new - invoice.water_old} m³)`} value={formatVND(invoice.water_amount)} />
        <Row label={`Phí quản lý (${invoice.occupants} người)`} value={formatVND(invoice.management_fee_amount)} />
        {invoice.other_fees ? <Row label={invoice.other_note || 'Phí khác'} value={formatVND(invoice.other_fees)} /> : null}
        <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
        <Row label="Tổng cộng" value={formatVND(invoice.total_amount)} bold />
        <Row label="Đã thanh toán" value={formatVND(invoice.paid_amount)} />
        <Row label="Hạn thanh toán" value={formatDate(invoice.due_date)} />
      </MobileCard>

      {invoice.status !== 'paid' && invoice.status !== 'cancelled' ? (
        <MobileCard style={{ alignItems: 'center', gap: space[3] }}>
          {qr ? (
            <>
              <Text style={[text.labelS, { color: theme.fg3 }]}>QUÉT MÃ ĐỂ THANH TOÁN</Text>
              <Image source={{ uri: qr }} style={{ width: 200, height: 200, borderRadius: 8 }} resizeMode="contain" />
            </>
          ) : (
            <>
              <MobileButton title="Quét mã thanh toán (VietQR)" variant="secondary" onPress={onLoadQr} loading={qrLoading} />
              {qrError ? <Text style={[text.bodyS, { color: theme.danger, textAlign: 'center' }]}>{qrError}</Text> : null}
            </>
          )}
        </MobileCard>
      ) : null}

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>LỊCH SỬ THANH TOÁN</Text>
        {payments.length ? payments.map((p) => (
          <Row key={p.id} label={`${formatDate(p.paid_at)} · ${paymentMethodLabel(p.method)}`} value={formatVND(p.amount)} />
        )) : <Text style={[text.bodyS, { color: theme.fg3 }]}>Chưa có thanh toán nào</Text>}
      </MobileCard>
    </ScrollView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={[text.bodyS, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[bold ? text.labelM : text.bodyS, { color: theme.fg1 }]}>{value}</Text>
    </View>
  );
}
