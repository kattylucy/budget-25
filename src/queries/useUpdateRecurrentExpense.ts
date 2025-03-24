import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { CreateRecurrentExpense } from '@/types/expenses';

interface UpdateRecurrentExpenseParams {
  id: string;
  expenseData: CreateRecurrentExpense
}

export const useUpdateRecurrentExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, expenseData }: UpdateRecurrentExpenseParams) => {
      const { error, data } = await supabase
        .from("recurrent_expenses")
        .update(expenseData)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurrent_expenses'] });
      toast.success("Expense updated")
    },
  });
};
