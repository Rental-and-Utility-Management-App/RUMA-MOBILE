import { client, unwrap } from './client';
import { Invoice } from './types';

export function listInvoices(params?: { status?: string; room_id?: string; month?: number; year?: number }) {
  return unwrap<Invoice[]>(client.get('/invoices', { params }));
}

export function getInvoice(id: string) {
  return unwrap<Invoice>(client.get(`/invoices/${id}`));
}

export function getInvoiceQRCode(id: string) {
  return unwrap<{ qr_data_url?: string; qr_url?: string; content?: string }>(
    client.get(`/invoices/${id}/qr-code`)
  );
}
