
import React from "react";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expense, Income } from "./ExpenseDialog";
import { useExpenseForm } from "@/hooks/useExpenseForm";

// Import form field components
import NameField from "./form-fields/NameField";
import CategoryField from "./form-fields/CategoryField";
import AmountField from "./form-fields/AmountField";
import DateField from "./form-fields/DateField";
import { BankAccountField } from "./form-fields/BankAccountField";

interface ExpenseFormProps {
  currentExpense: Expense | null;
  income: Income | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ExpenseForm = ({ 
  currentExpense, 
  income, 
  onSuccess, 
  onCancel 
}: ExpenseFormProps) => {
  const { form, onSubmit, selectedCategory, isSubmitting } = useExpenseForm(currentExpense, onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameField form={form} />
        <CategoryField 
          form={form} 
          onCategoryChange={(value) => {}}
        />
        
        <AmountField form={form} />
        <DateField form={form} />
        
        <BankAccountField form={form} />
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : currentExpense ? "Save Changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ExpenseForm;
