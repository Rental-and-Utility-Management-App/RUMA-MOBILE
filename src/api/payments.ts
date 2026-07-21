import { client, unwrap } from './client';
import { Payment } from './types';

export function listPayments(params?: { invoice_id?: string; room_id?: string }) {
  return unwrap<Payment[]>(client.get('/payments', { params }));
}
