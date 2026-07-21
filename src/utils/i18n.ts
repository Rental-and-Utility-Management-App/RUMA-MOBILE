export function roleLabel(role?: string): string {
  const map: Record<string, string> = { manager: 'Quản lý', tenant: 'Người thuê' };
  return map[role || ''] || role || '';
}

export function roomStatusLabel(status?: string): string {
  const map: Record<string, string> = { available: 'Còn trống', occupied: 'Đang thuê' };
  return map[status || ''] || status || '';
}

export function paymentStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    no_invoice: 'Chưa có hóa đơn',
    draft: 'Nháp',
    unpaid: 'Chưa thanh toán',
    partial: 'Thanh toán một phần',
    paid: 'Đã thanh toán',
  };
  return map[status || ''] || status || '';
}

export function invoiceStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    draft: 'Nháp',
    unpaid: 'Chưa thanh toán',
    partial: 'Thanh toán một phần',
    paid: 'Đã thanh toán',
    cancelled: 'Đã hủy',
  };
  return map[status || ''] || status || '';
}

export function contractStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    active: 'Đang hiệu lực',
    ended: 'Đã kết thúc',
    terminated: 'Đã chấm dứt',
    cancelled: 'Đã hủy',
  };
  return map[status || ''] || status || '';
}

export function paymentMethodLabel(method?: string): string {
  const map: Record<string, string> = { cash: 'Tiền mặt', bank_transfer: 'Chuyển khoản', other: 'Khác' };
  return map[method || ''] || method || '';
}

export function depositStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    unpaid: 'Chưa đóng cọc',
    partial: 'Đóng cọc một phần',
    held: 'Đang giữ cọc',
    partial_refunded: 'Đã hoàn một phần cọc',
    refunded: 'Đã hoàn cọc',
    forfeited: 'Mất cọc',
  };
  return map[status || ''] || status || '';
}
