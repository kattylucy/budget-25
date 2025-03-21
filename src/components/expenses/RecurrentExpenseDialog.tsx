
import React from "react";
import { RecurrentExpense } from "../recurrent-expenses/RecurrentExpensesPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecurrentExpenseForm } from "./recurrent-expense/RecurrentExpenseForm";
import { useRecurrentExpenseForm } from "./hooks/useRecurrentExpenseForm";

interface RecurrentExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentExpense: RecurrentExpense | null;
  onSuccess: () => void;
}

const RecurrentExpenseDialog = ({
  isOpen,
  onOpenChange,
  currentExpense,
  onSuccess,
}: RecurrentExpenseDialogProps) => {
  const {
    form,
    isSubmitting,
    isSavingsCategory,
    onCategoryChange,
    onSubmit,
  } = useRecurrentExpenseForm({
    currentExpense,
    onSuccess,
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentExpense ? "Edit Recurring Expense" : "Add Recurring Expense"}
          </DialogTitle>
        </DialogHeader>

        <RecurrentExpenseForm
          form={form}
          isSavingsCategory={isSavingsCategory}
          isSubmitting={isSubmitting}
          onCategoryChange={onCategoryChange}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isEditing={!!currentExpense}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecurrentExpenseDialog;
