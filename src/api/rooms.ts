import { client, unwrap } from './client';
import { Room } from './types';

export function listRooms(params?: { status?: string; q?: string }) {
  return unwrap<Room[]>(client.get('/rooms', { params }));
}

export function getRoom(id: string) {
  return unwrap<Room>(client.get(`/rooms/${id}`));
}

export function checkoutRoom(id: string) {
  return unwrap<null>(client.post(`/rooms/${id}/checkout`));
}
