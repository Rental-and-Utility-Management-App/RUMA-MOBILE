import { client, unwrap } from './client';
import { UserResponse } from './types';

export function login(phone: string, password: string) {
  return unwrap<{ token: string; user: UserResponse }>(
    client.post('/auth/login', { phone, password })
  );
}

export function me() {
  return unwrap<UserResponse>(client.get('/auth/me'));
}

export function changePassword(old_password: string, new_password: string) {
  return unwrap<null>(client.put('/auth/change-password', { old_password, new_password }));
}
