
import { useMemo, useState } from "react";
import { Expense } from "./ExpenseDialog";
import { bankAccounts } from "./constants";

export const useExpensesFiltering = (expenses: Expense[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [hideSavings, setHideSavings] = useState(false);

  // Extract unique bank accounts from expenses and include the predefined options
  const availableBankAccounts = useMemo(() => {
    // Start with "all" option
    const uniqueAccounts = new Set<string>(["all"]);
    
    // Add all bank accounts from constants
    bankAccounts.forEach(account => {
      uniqueAccounts.add(account);
    });
    
    // Add any other accounts that might be in the expenses data
    expenses.forEach(expense => {
      if (expense.bank_account) {
        uniqueAccounts.add(expense.bank_account);
      }
    });
    
    return Array.from(uniqueAccounts);
  }, [expenses]);

  // Apply filters to expenses
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    // Apply bank account filter
    if (bankFilter !== "all") {
      filtered = filtered.filter(expense => 
        expense.bank_account === bankFilter
      );
    }
    
    // Apply savings filter
    if (hideSavings) {
      filtered = filtered.filter(expense => expense.category.toLowerCase() !== "savings");
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.name.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        String(expense.amount).includes(query) ||
        (expense.bank_account && expense.bank_account.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [expenses, searchQuery, bankFilter, hideSavings]);

  return {
    searchQuery,
    setSearchQuery,
    bankFilter,
    setBankFilter,
    hideSavings,
    setHideSavings,
    bankAccounts: availableBankAccounts,
    filteredExpenses
  };
};
