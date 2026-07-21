export type Role = 'manager' | 'tenant';

export interface UserResponse {
  id: string; full_name: string; phone: string; email?: string; role: Role;
  room_id?: string; is_active: boolean; avatar_url?: string; room?: Room;
}

export type RoomStatus = 'available' | 'occupied';
export type RoomPaymentStatus = 'no_invoice' | 'draft' | 'unpaid' | 'partial' | 'paid';

export interface RoomCurrentMonthPayment {
  month: number; year: number; status: RoomPaymentStatus;
  invoice_id?: string; total_amount?: number; paid_amount?: number; due_date?: string; overdue?: boolean;
}

export interface Room {
  id: string; code: string; name?: string; floor?: number;
  tenant_ids?: string[]; tenants?: UserResponse[]; capacity: number;
  monthly_rent: number; price_electricity: number; price_water: number;
  occupants: number; management_fee_per_person: number;
  status: RoomStatus; note?: string;
  current_month_payment?: RoomCurrentMonthPayment;
  created_at: string; updated_at: string;
}

export type ContractStatus = 'active' | 'ended' | 'terminated' | 'cancelled';
export type DepositStatus = 'unpaid' | 'partial' | 'held' | 'partial_refunded' | 'refunded' | 'forfeited';

export interface TenantBrief { id: string; full_name: string; phone: string; }

export interface Contract {
  id: string; room_id: string; room_code?: string;
  tenant_ids: string[]; tenants?: TenantBrief[];
  monthly_rent: number; deposit_amount: number; deposit_paid: number; deposit_refunded: number;
  deposit_status: DepositStatus;
  start_date: string; end_date: string; actual_end_date?: string;
  status: ContractStatus; note?: string; created_at: string; updated_at: string;
}

export type InvoiceStatus = 'draft' | 'unpaid' | 'partial' | 'paid' | 'cancelled';

export interface Invoice {
  id: string; room_id: string; tenant_id: string; month: number; year: number;
  rent_amount: number;
  electric_old: number; electric_new: number; electric_price: number; electric_amount: number;
  water_old: number; water_new: number; water_price: number; water_amount: number;
  other_fees?: number; other_note?: string;
  occupants: number; management_fee_per_person: number; management_fee_amount: number;
  total_amount: number; paid_amount: number; status: InvoiceStatus;
  overdue?: boolean; due_date: string; created_at: string; updated_at: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'other';

export interface Payment {
  id: string; invoice_id: string; room_id: string; tenant_id: string;
  amount: number; method: PaymentMethod; note?: string; paid_at: string; created_at: string;
}

export interface ReportSummary {
  total_rooms?: number; occupied_rooms?: number; available_rooms?: number;
  monthly_revenue?: number; outstanding_amount?: number; occupancy_rate?: number;
  [key: string]: unknown;
}
