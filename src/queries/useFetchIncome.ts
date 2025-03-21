import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFetchIncome = () => {
  return useQuery({
    queryKey: ['income'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("income")
        .select("*")
      
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  });
};
