import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) { onUnauthorized = fn; }

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('ruma_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) onUnauthorized?.();
    const message = err?.response?.data?.message || err.message || 'Lỗi kết nối mạng';
    return Promise.reject(new Error(message));
  }
);

// Backend envelope is always { success, message, data }.
export async function unwrap<T>(promise: Promise<{ data: { success: boolean; message: string; data: T } }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}
