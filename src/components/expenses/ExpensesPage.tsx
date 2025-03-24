
import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expense } from "./ExpenseDialog";
import ExpensesList from "./ExpensesList";
import IncomeSection from "./IncomeSection";
import SummaryCards from "./SummaryCards";
import CloseMonthDialog from "./CloseMonthDialog";
import ExpenseFormDialog from "./ExpenseFormDialog";
import { useFetchExpenses } from "@/queries/useFetchExpenses";
import { useFetchRecurrentExpenses } from "@/queries/useFetchRecurrentExpenses";
import { useFetchIncome } from "@/queries/useFetchIncome";

const ExpensesPage = () => {
  const { data: expenses, isLoading: expensesLoading } = useFetchExpenses();
  const { data: recurrentExpenses, isLoading: recurrentExpensesLoading } = useFetchRecurrentExpenses();
  const { data: income, isLoading: incomeLoading } = useFetchIncome();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCloseMonthDialogOpen, setIsCloseMonthDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);

  const openExpenseDialog = (expense: Expense | null = null) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const totalIncome = income?.reduce((total, income) => total + income.amount, 0);
  const regularExpensesTotal = expenses?.reduce((total, expense) => total + expense.amount, 0);
  const recurrentExpensesTotal = recurrentExpenses?.reduce((total, expense) => total + expense.amount, 0);
  const totalExpenses = regularExpensesTotal + recurrentExpensesTotal;
  const balance = totalIncome - totalExpenses;

  if(expensesLoading || recurrentExpensesLoading || incomeLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      <IncomeSection  />
      <SummaryCards 
        income={totalIncome}
        expenses={totalExpenses}
        balance={balance}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Expenses</h2>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsCloseMonthDialogOpen(true)} 
              variant="outline" 
              className="flex items-center"
              disabled={expenses.length === 0}
            >
              <Archive className="h-4 w-4 mr-2" />
              Close Month
            </Button>
            <Button onClick={() => openExpenseDialog()}>Add Expense</Button>
          </div>
        </div>

        <ExpensesList 
          expenses={expenses}
          isLoading={expensesLoading}
          onEdit={openExpenseDialog}
        />
      </div>

      <ExpenseFormDialog 
        isOpen={isDialogOpen}
        currentExpense={currentExpense}
        toggleModal={(val) => setIsDialogOpen(val)}
      />

      <CloseMonthDialog 
        open={isCloseMonthDialogOpen}
        onOpenChange={setIsCloseMonthDialogOpen}
        expenses={expenses}
        income={totalIncome}
        balance={balance}
        recurrentExpenses={recurrentExpenses}
      />
    </div>
  );
};

export default ExpensesPage;
