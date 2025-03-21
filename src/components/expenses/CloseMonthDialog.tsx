
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "./ExpenseDialog";
import { RecurrentExpense } from "../recurrent-expenses/RecurrentExpensesPage";

interface CloseMonthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: Expense[];
  income: number;
  balance: number;
  onSuccess: () => void;
  recurrentExpenses: RecurrentExpense[];
}

const CloseMonthDialog = ({
  open,
  onOpenChange,
  expenses,
  income,
  balance,
  onSuccess,
  recurrentExpenses,
}: CloseMonthDialogProps) => {
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseMonth = async () => {
    if (!selectedMonth) return;
    
    try {
      setIsSubmitting(true);
      
      // Archive existing expenses
      const { error: archiveError } = await supabase
        .from("expenses")
        .update({ is_deleted: true })
        .eq("is_deleted", false);
      
      if (archiveError) throw archiveError;
      
      // Archive existing savings entries
      const { error: savingsArchiveError } = await supabase
        .from("savings")
        .update({ is_deleted: true })
        .eq("is_deleted", false);
      
      if (savingsArchiveError) {
        console.error("Error archiving savings:", savingsArchiveError);
        toast.error("Failed to archive savings entries");
        throw savingsArchiveError;
      }
      
      // Calculate total expenses
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalRecurrent = recurrentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      // Calculate the amount saved
      const amountSaved = expenses
        .filter(expense => expense.category.toLowerCase() === "savings")
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      // Add entry to history
      const { error: historyError } = await supabase
        .from("history")
        .insert({
          month: selectedMonth.toLocaleString('default', { month: 'long' }),
          year: new Date().getFullYear(),
          income: income,
          expenses: totalExpenses + totalRecurrent,
          remaining_balance: balance,
          amount_saved: amountSaved,
        });
      
      if (historyError) throw historyError;

      // Reset entertainment budget
      // Use type casting to bypass TypeScript error until types are regenerated
      const { error: budgetError } = await (supabase as any)
        .from("entertainment_budget")
        .update({ amount: 0 })
        .eq("id", "default");
      
      // We don't throw an error if this fails, as the record might not exist yet
      if (budgetError && budgetError.code !== "PGRST116") {
        console.error("Error resetting entertainment budget:", budgetError);
      }
      
      // If balance is negative, create an expense for the next month
      if (balance < 0) {
        const negativeBalanceExpense = {
          name: "Negative Balance Repaid",
          category: "Personal",
          amount: Math.abs(balance), // Make the amount positive for the expense
          date: new Date().toISOString().split('T')[0], // Today's date
          bank_account: "Apple",
          currency_symbol: "$",
        };
        
        const { error: negativeBalanceError } = await supabase
          .from("expenses")
          .insert(negativeBalanceExpense);
          
        if (negativeBalanceError) {
          console.error("Error creating negative balance expense:", negativeBalanceError);
          toast.error("Month closed but failed to add negative balance as expense");
        } else {
          toast.success("Month closed successfully with negative balance added as expense");
        }
      } else {
        toast.success("Month closed successfully");
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error closing month:", error);
      toast.error("Failed to close month");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close Month</DialogTitle>
          <DialogDescription>
            Are you sure you want to close the month? This will archive all current expenses and savings entries, and reset the entertainment budget.
            {balance < 0 && (
              <div className="mt-2 text-yellow-600 dark:text-yellow-400">
                Your balance is negative (${Math.abs(balance).toFixed(2)}). This amount will be added as an expense in the next month.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="month" className="text-right">
              Month
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 pl-3 font-normal text-left",
                    !selectedMonth && "text-muted-foreground"
                  )}
                >
                  {selectedMonth ? (
                    format(selectedMonth, "MMMM yyyy")
                  ) : (
                    <span>Pick a month</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" side="bottom">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={selectedMonth}
                  onSelect={setSelectedMonth}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleCloseMonth} disabled={isSubmitting || !selectedMonth}>
            {isSubmitting ? "Closing..." : "Close Month"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseMonthDialog;
