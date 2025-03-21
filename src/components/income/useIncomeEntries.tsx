
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { IncomeEntryType } from "./IncomeEntry";

export const useIncomeEntries = (onIncomeChange: () => void) => {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchIncomeEntries = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const { data, error } = await supabase
        .from("income")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Cast the data to IncomeEntryType[] since we know the structure matches
      setIncomeEntries(data as unknown as IncomeEntryType[]);
      console.log("Income entries loaded:", data);
    } catch (error) {
      console.error("Error fetching income entries:", error);
      setHasError(true);
      toast.error("Failed to load income entries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeEntries();
  }, []);

  const addIncomeEntry = async (entry: Partial<IncomeEntryType>) => {
    try {
      // Ensure amount is present and is a number
      if (typeof entry.amount !== 'number') {
        throw new Error("Amount must be a number");
      }
      
      const { data, error } = await supabase
        .from("income")
        .insert([entry as { amount: number }]) // Cast to ensure TypeScript knows amount is present
        .select();
      
      if (error) throw error;
      
      // Cast the data to IncomeEntryType since we know the structure matches
      setIncomeEntries(prev => [data[0] as unknown as IncomeEntryType, ...prev]);
      toast.success("Income added successfully");
      onIncomeChange();
      return true;
    } catch (error) {
      console.error("Error adding income entry:", error);
      toast.error("Failed to add income");
      return false;
    }
  };

  const deleteIncomeEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("income")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setIncomeEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success("Income entry deleted");
      onIncomeChange();
    } catch (error) {
      console.error("Error deleting income entry:", error);
      toast.error("Failed to delete income entry");
    }
  };

  const refreshEntries = () => {
    fetchIncomeEntries();
  };

  return {
    incomeEntries,
    isLoading,
    hasError,
    addIncomeEntry,
    deleteIncomeEntry,
    refreshEntries
  };
};
