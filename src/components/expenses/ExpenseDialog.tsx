

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  is_deleted?: boolean;
  savingsAccount?: string;
  bank_account?: string;
  notes?: string | null;
  is_paid?: boolean;
}

export interface Income {
  id: string;
  amount: number;
  category?: string;
  tag?: string;
}

