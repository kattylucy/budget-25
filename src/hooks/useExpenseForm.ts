
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Expense } from "@/components/expenses/ExpenseDialog";

// Define specific type for expense data
interface ExpenseData {
  name: string;
  category: string;
  amount: number;
  date: string;
  bank_account: string;
  currency_symbol: string;
  notes?: string | null;
}

export const useExpenseForm = (
  currentExpense: Expense | null, 
  onSuccess: () => void
) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      amount: "",
      date: new Date(),
      bank_account: "Betterment",
    },
  });

  useEffect(() => {
    if (currentExpense) {
      setSelectedCategory(currentExpense.category);
      
      form.reset({
        name: currentExpense.name,
        category: currentExpense.category,
        amount: currentExpense.amount.toString(),
        date: new Date(currentExpense.date),
        bank_account: currentExpense.bank_account || "Betterment",
      });
    } else {
      setSelectedCategory("");
      form.reset({
        name: "",
        category: "",
        amount: "",
        date: new Date(),
        bank_account: "Betterment",
      });
    }
  }, [currentExpense, form]);

  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        setIsSubmitting(false);
        return;
      }

      // Create the expense data object
      const expenseData: ExpenseData = {
        name: values.name,
        category: values.category,
        amount,
        date: values.date.toISOString().split('T')[0],
        bank_account: values.bank_account,
        currency_symbol: "$", // Always use USD
      };

      console.log("Saving expense:", expenseData);

      if (currentExpense) {
        // Update existing expense
        const { error } = await supabase
          .from("expenses")
          .update(expenseData)
          .eq("id", currentExpense.id);

        if (error) {
          console.error("Error updating expense:", error);
          toast.error("Failed to update expense: " + error.message);
          setIsSubmitting(false);
          throw error;
        }
      } else {
        // Insert new expense
        const { error } = await supabase
          .from("expenses")
          .insert({
            ...expenseData,
            is_deleted: false  // Explicitly set is_deleted to false for new expenses
          });

        if (error) {
          console.error("Error inserting expense:", error);
          toast.error("Failed to add expense: " + error.message);
          setIsSubmitting(false);
          throw error;
        }
      }

      toast.success(currentExpense ? "Expense updated successfully" : "Expense added successfully");
      onSuccess();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFormCategory = form.watch("category");
  
  useEffect(() => {
    setSelectedCategory(selectedFormCategory || "");
  }, [selectedFormCategory]);

  return {
    form,
    onSubmit,
    selectedCategory,
    isSubmitting,
  };
};
