
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import CloseMonthDialog from "./CloseMonthDialog";
import { Expense } from "../expenses/ExpenseDialog";

interface CloseMonthButtonProps {
  currentMonth: string;
  expenses: Expense[];
  totalIncome: number;
  onMonthClosed: () => void;
}

const CloseMonthButton = ({
  currentMonth,
  expenses,
  totalIncome,
  onMonthClosed,
}: CloseMonthButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate totals
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const savingsExpenses = expenses
    .filter((expense) => expense.category === "Savings")
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  // Calculate bank account totals
  const appleTotal = expenses
    .filter((expense) => expense.bank_account === "Apple")
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const chaseTotal = expenses
    .filter((expense) => expense.bank_account === "Chase")
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const euroTotal = expenses
    .filter((expense) => expense.bank_account === "EURO")
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <Lock className="h-4 w-4" />
        Close Month
      </Button>

      <CloseMonthDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentMonth={currentMonth}
        income={totalIncome}
        expenses={totalExpenses}
        savings={savingsExpenses}
        appleTotal={appleTotal}
        chaseTotal={chaseTotal}
        euroTotal={euroTotal}
        onSuccess={onMonthClosed}
      />
    </>
  );
};

export default CloseMonthButton;
