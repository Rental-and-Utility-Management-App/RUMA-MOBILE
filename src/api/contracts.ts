import { client, unwrap } from './client';
import { Contract } from './types';

export function listContracts(params?: { status?: string; room_id?: string }) {
  return unwrap<Contract[]>(client.get('/contracts', { params }));
}

export function getContract(id: string) {
  return unwrap<Contract>(client.get(`/contracts/${id}`));
}
