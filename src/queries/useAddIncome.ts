import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useAddIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: { amount: number }) => {
      const { data, error } = await supabase
        .from("income")
        .insert([entry])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income'] });
      toast.success("Income added successfully");
    },
  });
};
