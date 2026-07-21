import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { theme, text, space } from '../theme/tokens';
import { MobileCard } from '../components/MobileCard';
import { MobileBadge as Badge, invoiceTone } from '../components/MobileBadge';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const inv = await invoicesApi.getInvoice(params.id);
      setInvoice(inv);
      const [pays, qrRes] = await Promise.allSettled([
        paymentsApi.listPayments({ invoice_id: params.id }),
        invoicesApi.getInvoiceQRCode(params.id),
      ]);
      if (pays.status === 'fulfilled') setPayments(pays.value);
      if (qrRes.status === 'fulfilled') {
        const raw = qrRes.value.qr_data_url || qrRes.value.qr_url || qrRes.value.content || null;
        setQr(raw && !raw.startsWith('http') && !raw.startsWith('data:') ? `data:image/png;base64,${raw}` : raw);
      }
    } catch (e: any) { setError(e.message); }
  }, [params.id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

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

      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && qr ? (
        <MobileCard style={{ alignItems: 'center', gap: space[3] }}>
          <Text style={[text.labelS, { color: theme.fg3 }]}>QUÉT MÃ ĐỂ THANH TOÁN</Text>
          <Image source={{ uri: qr }} style={{ width: 200, height: 200, borderRadius: 8 }} resizeMode="contain" />
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
