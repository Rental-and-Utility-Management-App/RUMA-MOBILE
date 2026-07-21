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

  if (loading) return <LoadingState label="Loading invoice…" />;
  if (error || !invoice) return <ErrorState message={error || 'Not found'} onRetry={load} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bgPage }} contentContainerStyle={{ padding: space[5], gap: space[4] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[text.displayM, { color: theme.fg1 }]}>{monthLabel(invoice.month, invoice.year)}</Text>
        <Badge label={invoice.status} tone={invoiceTone(invoice.status)} />
      </View>

      <MobileCard style={{ gap: space[3] }}>
        <Row label="Rent" value={formatVND(invoice.rent_amount)} />
        <Row label={`Electricity (${invoice.electric_new - invoice.electric_old} kWh)`} value={formatVND(invoice.electric_amount)} />
        <Row label={`Water (${invoice.water_new - invoice.water_old} m³)`} value={formatVND(invoice.water_amount)} />
        <Row label={`Management fee (${invoice.occupants}p)`} value={formatVND(invoice.management_fee_amount)} />
        {invoice.other_fees ? <Row label={invoice.other_note || 'Other fees'} value={formatVND(invoice.other_fees)} /> : null}
        <View style={{ height: 1, backgroundColor: theme.borderSubtle }} />
        <Row label="Total" value={formatVND(invoice.total_amount)} bold />
        <Row label="Paid" value={formatVND(invoice.paid_amount)} />
        <Row label="Due date" value={formatDate(invoice.due_date)} />
      </MobileCard>

      {invoice.status !== 'paid' && invoice.status !== 'cancelled' && qr ? (
        <MobileCard style={{ alignItems: 'center', gap: space[3] }}>
          <Text style={[text.labelS, { color: theme.fg3 }]}>SCAN TO PAY</Text>
          <Image source={{ uri: qr }} style={{ width: 200, height: 200, borderRadius: 8 }} resizeMode="contain" />
        </MobileCard>
      ) : null}

      <MobileCard style={{ gap: space[3] }}>
        <Text style={[text.labelS, { color: theme.fg3 }]}>PAYMENT HISTORY</Text>
        {payments.length ? payments.map((p) => (
          <Row key={p.id} label={`${formatDate(p.paid_at)} · ${p.method.replace('_', ' ')}`} value={formatVND(p.amount)} />
        )) : <Text style={[text.bodyS, { color: theme.fg3 }]}>No payments recorded</Text>}
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
