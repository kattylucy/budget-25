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

export interface CreateExpense {
  name: string;
  category: string;
  amount: number;
  date: string;
  is_deleted: boolean;
  savings_account: string;
  bank_account: string;
  is_paid: boolean;
}


export interface ExpensesListProps {
    expenses: Expense[];
    isLoading: boolean;
    onEdit: (expense: Expense) => void;
  }