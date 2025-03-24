import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { CreateExpense } from '@/types/expenses';

interface UpdateExpenseParams {
  id: string;
  expenseData: CreateExpense;
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, expenseData }: UpdateExpenseParams) => {
      const { error, data } = await supabase
        .from("expenses")
        .update(expenseData)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Expense updated")
    },
  });
};
