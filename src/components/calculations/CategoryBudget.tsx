
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { useCategoryExpenses } from "./useCategoryExpenses";
import { Expense } from "@/components/expenses/ExpenseDialog";
import { RecurrentExpense } from "@/components/recurrent-expenses/RecurrentExpensesPage";

interface CategoryBudgetProps {
  expenses: Expense[];
  recurrentExpenses: RecurrentExpense[];
}

// Define the type for the entertainment budget
interface EntertainmentBudget {
  id: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export const CategoryBudget = ({ expenses, recurrentExpenses }: CategoryBudgetProps) => {
  const [budget, setBudget] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the current budget
  const { data: budgetData, refetch } = useQuery({
    queryKey: ["entertainment-budget"],
    queryFn: async () => {
      // Cast the query to any to bypass TypeScript error until types are regenerated
      const { data, error } = await (supabase as any)
        .from("entertainment_budget")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
        console.error("Error fetching budget:", error);
        throw error;
      }
      
      return data as EntertainmentBudget || { id: "default", amount: 0 };
    },
  });

  useEffect(() => {
    if (budgetData) {
      setBudget(budgetData.amount || 0);
      setIsLoading(false);
    }
  }, [budgetData]);

  const { entertainmentAndFoodTotals, totalAmount } = useCategoryExpenses(
    expenses,
    recurrentExpenses
  );

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBudget(value);
  };

  const saveBudget = async () => {
    try {
      setIsLoading(true);
      const { error } = await (supabase as any)
        .from("entertainment_budget")
        .upsert({ id: budgetData?.id || "default", amount: budget })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Budget updated successfully");
      refetch();
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Failed to update budget");
    } finally {
      setIsLoading(false);
    }
  };

  const remainingBudget = budget - totalAmount;

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-4">Entertainment & Food Budget</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget Amount
          </label>
          <div className="flex gap-2">
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              className="flex-1"
            />
            <Button onClick={saveBudget} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex items-end">
          <div className="bg-gray-100 p-3 rounded-md w-full">
            <div className="text-sm text-gray-500">Remaining Budget</div>
            <div className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {remainingBudget.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">% of Budget</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entertainmentAndFoodTotals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                No entertainment or food expenses found
              </TableCell>
            </TableRow>
          ) : (
            entertainmentAndFoodTotals.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium capitalize">
                  {item.category}
                </TableCell>
                <TableCell className="text-right">
                  {item.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {budget > 0 ? ((item.amount / budget) * 100).toFixed(1) + "%" : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right">{totalAmount.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              {budget > 0 ? ((totalAmount / budget) * 100).toFixed(1) + "%" : "N/A"}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
