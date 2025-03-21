
import React, { useState, useEffect } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { Expense, Income } from "./ExpenseDialog";
import ExpensesList from "./ExpensesList";
import IncomeSection from "./IncomeSection";
import SummaryCards from "./SummaryCards";
import CloseMonthDialog from "./CloseMonthDialog";
import ExpenseFormDialog from "./ExpenseFormDialog";
import { RecurrentExpense } from "../recurrent-expenses/RecurrentExpensesPage";

const ExpensesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurrentExpenses, setRecurrentExpenses] = useState<RecurrentExpense[]>([]);
  const [income, setIncome] = useState<Income | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCloseMonthDialogOpen, setIsCloseMonthDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeInEUR, setIncomeInEUR] = useState(0);
  const [incomeInUSD, setIncomeInUSD] = useState(0);
  const [fetchError, setFetchError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setFetchError(false);
    try {
      console.log("Fetching expenses data...");
      
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from("expenses")
        .select("*")
        .eq("is_deleted", false)
        .order("date", { ascending: false });

      if (expensesError) {
        console.error("Error fetching expenses:", expensesError);
        throw expensesError;
      }
      setExpenses(expensesData || []);
      console.log(`Loaded ${expensesData?.length || 0} expenses`);

      // Fetch recurrent expenses
      const { data: recurrentData, error: recurrentError } = await supabase
        .from("recurrent_expenses")
        .select("*")
        .eq("is_deleted", false);

      if (recurrentError) {
        console.error("Error fetching recurrent expenses:", recurrentError);
        throw recurrentError;
      }
      setRecurrentExpenses(recurrentData || []);
      console.log(`Loaded ${recurrentData?.length || 0} recurrent expenses`);

      // Fetch income data
      const { data: incomeData, error: incomeError } = await supabase
        .from("income")
        .select("*")
        .order("created_at", { ascending: false });

      if (incomeError) {
        console.error("Error fetching income:", incomeError);
        throw incomeError;
      }
      console.log(`Loaded ${incomeData?.length || 0} income entries`);
      
      // Sum all income amounts regardless of currency
      let totalAmount = 0;
      let eurAmount = 0;
      let usdAmount = 0;
      
      if (incomeData && incomeData.length > 0) {
        // Calculate total and currency-specific totals
        incomeData.forEach(item => {
          const amount = Number(item.amount);
          totalAmount += amount;
          
          if (item.currency === 'EUR') {
            eurAmount += amount;
          } else if (item.currency === 'USD') {
            usdAmount += amount;
          }
        });
      }
      
      console.log(`Total income: ${totalAmount}, EUR: ${eurAmount}, USD: ${usdAmount}`);
      setTotalIncome(totalAmount);
      setIncomeInEUR(eurAmount);
      setIncomeInUSD(usdAmount);
      
      if (incomeData && incomeData.length > 0) {
        // Use the first income entry but with updated total amount
        const aggregatedIncome: Income = {
          ...incomeData[0],
          amount: totalAmount
        };
        setIncome(aggregatedIncome);
      } else {
        setIncome(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true);
      toast.error("Failed to load data. Will retry in a few seconds.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up automatic retry if fetch fails
    if (fetchError) {
      const retryTimer = setTimeout(() => {
        console.log("Retrying data fetch after error...");
        fetchData();
      }, 5000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [refreshTrigger, fetchError]);

  const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const openExpenseDialog = (expense: Expense | null = null) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const regularExpensesTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
  
  const recurrentExpensesTotal = recurrentExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  const totalExpenses = regularExpensesTotal + recurrentExpensesTotal;
  
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6 pb-24">
      <IncomeSection income={income} onIncomeChange={handleDataChange} />

      <SummaryCards 
        income={totalIncome}
        expenses={totalExpenses}
        balance={balance}
        incomeInEUR={incomeInEUR}
        incomeInUSD={incomeInUSD}
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
          isLoading={isLoading}
          onEdit={openExpenseDialog}
          onDataChange={handleDataChange}
        />
      </div>

      <ExpenseFormDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentExpense={currentExpense}
        income={income}
        onSuccess={handleDataChange}
      />

      <CloseMonthDialog 
        open={isCloseMonthDialogOpen}
        onOpenChange={setIsCloseMonthDialogOpen}
        expenses={expenses}
        income={totalIncome}
        balance={balance}
        onSuccess={handleDataChange}
        recurrentExpenses={recurrentExpenses}
      />
    </div>
  );
};

export default ExpensesPage;
