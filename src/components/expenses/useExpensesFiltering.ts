
import { useMemo, useState } from "react";
import { Expense } from "./ExpenseDialog";
import { bankAccounts } from "./constants";
import { useFetchExpenses } from "@/queries/useFetchExpenses";

export const useExpensesFiltering = () => {
  const { data: expenses } = useFetchExpenses()
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [hideSavings, setHideSavings] = useState(false);

  const availableBankAccounts = useMemo(() => {
    // Start with "all" option
    const uniqueAccounts = new Set<string>(["all"]);
    
    bankAccounts.forEach(account => {
      uniqueAccounts.add(account);
    });
    
    expenses.forEach(expense => {
      if (expense.bank_account) {
        uniqueAccounts.add(expense.bank_account);
      }
    });
    
    return Array.from(uniqueAccounts);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (bankFilter !== "all") {
      filtered = filtered.filter(expense => 
        expense.bank_account === bankFilter
      );
    }
    
    if (hideSavings) {
      filtered = filtered.filter(expense => expense.category.toLowerCase() !== "savings");
    }
    
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
    bankAccounts: availableBankAccounts,
    filteredExpenses
  };
};
