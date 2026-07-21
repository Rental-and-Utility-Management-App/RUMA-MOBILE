export function formatVND(n: number | undefined | null): string {
  if (n == null) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(Math.round(n)) + ' đ';
}

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function monthLabel(month: number, year: number): string {
  return `${String(month).padStart(2, '0')}/${year}`;
}
