
import  { useMemo } from "react";
import TableSearch from "@/components/ui/table-search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurrentExpense } from "./RecurrentExpensesPage";

interface RecurrentExpenseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  bankFilter: string;
  onBankFilterChange: (value: string) => void;
  expenses: RecurrentExpense[];
}

export const RecurrentExpenseFilters = ({
  searchQuery,
  onSearchChange,
  bankFilter,
  onBankFilterChange,
  expenses,
}: RecurrentExpenseFiltersProps) => {
  const bankAccounts = useMemo(() => {
    const accounts = new Set<string>();
    expenses.forEach(expense => {
      if (expense.bank_account) {
        accounts.add(expense.bank_account);
      }
    });
    return ["all", ...Array.from(accounts)];
  }, [expenses]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
      <TableSearch 
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search recurring expenses..."
      />
      
      <div className="w-full sm:w-auto min-w-[200px]">
        <Select 
          value={bankFilter} 
          onValueChange={onBankFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by bank account" />
          </SelectTrigger>
          <SelectContent>
            {bankAccounts.map(account => (
              <SelectItem key={account} value={account}>
                {account === "all" ? "All bank accounts" : account}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    
    </div>
  );
};
