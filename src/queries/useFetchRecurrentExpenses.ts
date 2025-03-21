import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFetchRecurrentExpenses = () => {
  return useQuery({
    queryKey: ['recurrent_expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurrent_expenses")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};
