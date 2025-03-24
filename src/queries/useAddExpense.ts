import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { CreateExpense } from '@/types/expenses';

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseData: CreateExpense) => {
      const { error, data } = await supabase
        .from("expenses")
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
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("New expense added")
    },
  });
};
