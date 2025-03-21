
import { useMemo } from "react";
import { Expense } from "@/components/expenses/ExpenseDialog";
import { RecurrentExpense } from "@/components/recurrent-expenses/RecurrentExpensesPage";

export interface CategoryTotal {
  category: string;
  amount: number;
}

export const useCategoryExpenses = (
  expenses: Expense[],
  recurrentExpenses: RecurrentExpense[]
) => {
  // Calculate totals by category
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    // Add regular expenses to totals
    expenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      if (!totals[category]) {
        totals[category] = 0;
      }
      totals[category] += Number(expense.amount);
    });
    
    // Add recurrent expenses to totals
    recurrentExpenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      if (!totals[category]) {
        totals[category] = 0;
      }
      totals[category] += Number(expense.amount);
    });
    
    // Convert to array format for easier usage
    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [expenses, recurrentExpenses]);
  
  // Filter for entertainment, food, and eating out categories
  const entertainmentAndFoodTotals = useMemo(() => {
    return categoryTotals.filter(item => 
      item.category.toLowerCase() === 'entertainment' || 
      item.category.toLowerCase() === 'food' ||
      item.category.toLowerCase() === 'eating out'
    );
  }, [categoryTotals]);
  
  // Calculate entertainment and food grand total
  const totalAmount = useMemo(() => {
    return entertainmentAndFoodTotals.reduce((sum, item) => sum + item.amount, 0);
  }, [entertainmentAndFoodTotals]);

  // Filter for groceries category
  const groceriesTotals = useMemo(() => {
    return categoryTotals.filter(item => 
      item.category.toLowerCase() === 'groceries'
    );
  }, [categoryTotals]);
  
  // Calculate groceries grand total
  const groceriesTotalAmount = useMemo(() => {
    return groceriesTotals.reduce((sum, item) => sum + item.amount, 0);
  }, [groceriesTotals]);
  
  return {
    categoryTotals,
    entertainmentAndFoodTotals,
    totalAmount,
    groceriesTotals,
    groceriesTotalAmount
  };
};
