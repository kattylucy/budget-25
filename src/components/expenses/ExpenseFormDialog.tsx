
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Expense, Income } from "./ExpenseDialog";
import ExpenseForm from "./ExpenseForm";

interface ExpenseFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentExpense: Expense | null;
  income: Income | null;
  onSuccess: () => void;
}

const ExpenseFormDialog = ({
  isOpen,
  onOpenChange,
  currentExpense,
  income,
  onSuccess,
}: ExpenseFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentExpense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>
        <ExpenseForm
          currentExpense={currentExpense}
          income={income}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess();
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseFormDialog;
