import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { CreateRecurrentExpense } from '@/types/expenses';

export const useCreateRecurrentExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: CreateRecurrentExpense) => {
      const { error, data } = await supabase
        .from("recurrent_expenses")
        .insert({
          ...expenseData,
          is_deleted: false,
        });
      
      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurrent_expenses'] });
      toast.success("New expense added")
    },
  });
};
