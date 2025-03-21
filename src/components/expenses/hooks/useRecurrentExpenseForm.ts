
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RecurrentExpense } from "../../recurrent-expenses/RecurrentExpensesPage";
import { recurrentExpenseSchema, RecurrentExpenseFormValues } from "../schemas/recurrentExpenseSchema";

interface UseRecurrentExpenseFormProps {
  currentExpense: RecurrentExpense | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const useRecurrentExpenseForm = ({ 
  currentExpense, 
  onSuccess, 
  onClose 
}: UseRecurrentExpenseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingsCategory, setIsSavingsCategory] = useState(false);

  const form = useForm<RecurrentExpenseFormValues>({
    resolver: zodResolver(recurrentExpenseSchema),
    defaultValues: {
      name: "",
      category: "",
      amount: 0,
      bank_account: "Betterment",
    },
  });

  useEffect(() => {
    if (currentExpense) {
      form.reset({
        name: currentExpense.name,
        category: currentExpense.category,
        amount: currentExpense.amount,
        bank_account: currentExpense.bank_account || "Betterment",
      });

      setIsSavingsCategory(false);
    } else {
      form.reset({
        name: "",
        category: "",
        amount: 0,
        bank_account: "Betterment",
      });
      setIsSavingsCategory(false);
    }
  }, [currentExpense, form]);

  const onCategoryChange = (value: string) => {
    setIsSavingsCategory(false);
  };

  const onSubmit = async (values: RecurrentExpenseFormValues) => {
    try {
      setIsSubmitting(true);

      const expenseData = {
        name: values.name,
        category: values.category,
        amount: values.amount,
        bank_account: values.bank_account,
        currency_symbol: "$", // Always use $ now
      };

      if (currentExpense) {
        // Update existing expense
        const { error } = await supabase
          .from("recurrent_expenses")
          .update(expenseData)
          .eq("id", currentExpense.id);

        if (error) throw error;
        toast.success("Recurring expense updated successfully");
      } else {
        // Create new expense
        const { error } = await supabase
          .from("recurrent_expenses")
          .insert([{ ...expenseData, is_deleted: false }]);

        if (error) throw error;
        toast.success("Recurring expense added successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving recurring expense:", error);
      toast.error("Failed to save recurring expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isSavingsCategory,
    onCategoryChange,
    onSubmit,
  };
};
