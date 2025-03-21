
import React, { useMemo } from "react";
import TableSearch from "@/components/ui/table-search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RecurrentExpense } from "./RecurrentExpensesPage";

interface RecurrentExpenseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  bankFilter: string;
  onBankFilterChange: (value: string) => void;
  hideSavings: boolean;
  onHideSavingsChange: (value: boolean) => void;
  expenses: RecurrentExpense[];
}

export const RecurrentExpenseFilters = ({
  searchQuery,
  onSearchChange,
  bankFilter,
  onBankFilterChange,
  hideSavings,
  onHideSavingsChange,
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

      <div className="flex items-center space-x-2">
        <Switch 
          id="hide-savings" 
          checked={hideSavings} 
          onCheckedChange={onHideSavingsChange}
        />
        <Label htmlFor="hide-savings">Hide savings</Label>
      </div>
    </div>
  );
};
