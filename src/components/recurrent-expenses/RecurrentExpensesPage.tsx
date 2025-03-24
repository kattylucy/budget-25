
import { useState } from "react";
import { toast } from "sonner";
import { RecurrentExpenseFilters } from "./RecurrentExpenseFilters";
import { RecurrentExpensesList } from "./RecurrentExpensesList";
import { RecurrentExpenseSummary } from "./RecurrentExpenseSummary";
import ExpenseFormDialog from "../expenses/ExpenseFormDialog";
import { useFetchRecurrentExpenses } from "@/queries/useFetchRecurrentExpenses";
import { useDeleteRecurrentExpense } from "@/queries/useDeletecurrentExpenses";

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
  const { data: recurrentExpenses, isLoading } = useFetchRecurrentExpenses()
  const { mutate } = useDeleteRecurrentExpense()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<RecurrentExpense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bankFilter, setBankFilter] = useState<string>("all");

  const openExpenseDialog = (expense: RecurrentExpense | null = null) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const deleteExpense = async (id: string) => {
    try {
      mutate(id)
    } catch (error) {
      toast.error("Failed to delete recurrent expense. Please try again.");
    }
  };  

  const totalMonthlyExpenses = (recurrentExpenses || []).reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const toggleModal = (boolean) => {
    setIsDialogOpen(boolean)
    setCurrentExpense(null)
  }

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

      <ExpenseFormDialog 
       isRecurring
       currentExpense={currentExpense}  
       isOpen={isDialogOpen} 
       toggleModal={toggleModal}
      />
    </div>
  );
};

export default RecurrentExpensesPage;
