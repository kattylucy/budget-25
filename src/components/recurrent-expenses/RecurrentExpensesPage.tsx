
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecurrentExpenseFilters } from "./RecurrentExpenseFilters";
import { RecurrentExpensesList } from "./RecurrentExpensesList";
import { RecurrentExpenseSummary } from "./RecurrentExpenseSummary";
import RecurrentExpenseDialog from "../expenses/RecurrentExpenseDialog";

export interface RecurrentExpense {
  id: string;
  name: string;
  category: string;
  amount: number;
  bank_account?: string;
  created_at: string;
  is_deleted?: boolean;
}

const RecurrentExpensesPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<RecurrentExpense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [hideSavings, setHideSavings] = useState(false);

  const { data: recurrentExpenses, isLoading, refetch } = useQuery({
    queryKey: ["recurrent-expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurrent_expenses")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching recurrent expenses:", error);
        throw error;
      }
      
      console.log("Recurrent expenses data:", data);
      return (data || []) as RecurrentExpense[];
    },
  });

  const openExpenseDialog = (expense: RecurrentExpense | null = null) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from("recurrent_expenses")
        .delete()
        .eq("id", id);
  
      if (error) throw error;
      
      toast.success("Recurrent expense deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting recurrent expense:", error);
      toast.error("Failed to delete recurrent expense. Please try again.");
    }
  };  

  const totalMonthlyExpenses = (recurrentExpenses || []).reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold">Recurring Expenses</h2>
            <p className="text-sm text-gray-500">
              These expenses will be automatically included each month
            </p>
          </div>
          
          <RecurrentExpenseSummary 
            totalMonthlyExpenses={totalMonthlyExpenses}
            onAddClick={() => openExpenseDialog()}
          />
        </div>

        {isLoading ? (
          <p className="text-center py-4">Loading recurring expenses...</p>
        ) : recurrentExpenses?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No recurring expenses found.</p>
          </div>
        ) : (
          <>
            <RecurrentExpenseFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              bankFilter={bankFilter}
              onBankFilterChange={setBankFilter}
              hideSavings={hideSavings}
              onHideSavingsChange={setHideSavings}
              expenses={recurrentExpenses || []}
            />
            
            <RecurrentExpensesList 
              expenses={recurrentExpenses || []}
              searchQuery={searchQuery}
              bankFilter={bankFilter}
              hideSavings={hideSavings}
              onEdit={openExpenseDialog}
              onDelete={deleteExpense}
            />
          </>
        )}
      </div>

      <RecurrentExpenseDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentExpense={currentExpense}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default RecurrentExpensesPage;
