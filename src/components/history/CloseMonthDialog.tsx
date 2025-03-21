
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CloseMonthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentMonth: string;
  income: number;
  expenses: number;
  savings: number;
  appleTotal: number;
  chaseTotal: number;
  euroTotal: number;
  onSuccess: () => void;
}

const CloseMonthDialog = ({
  isOpen,
  onOpenChange,
  currentMonth,
  income,
  expenses,
  savings,
  appleTotal,
  chaseTotal,
  euroTotal,
  onSuccess,
}: CloseMonthDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseMonth = async () => {
    try {
      setIsSubmitting(true);

      // First, check if this month has already been closed
      const { data: existingData, error: checkError } = await supabase
        .from("history")
        .select("id")
        .eq("month", currentMonth)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      // Calculate remaining balance
      const remainingBalance = income - expenses;
      // Get current year
      const currentYear = new Date().getFullYear();

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("history")
          .update({
            income,
            expenses,
            amount_saved: savings,
            total_apple: appleTotal,
            total_chase: chaseTotal,
            total_euro: euroTotal,
            remaining_balance: remainingBalance,
            year: currentYear
          })
          .eq("id", existingData.id);

        if (updateError) throw updateError;
        toast.success(`Budget for ${currentMonth} has been updated`);
      } else {
        // Create a new record
        const { error: insertError } = await supabase
          .from("history")
          .insert({
            month: currentMonth,
            income,
            expenses,
            amount_saved: savings,
            total_apple: appleTotal,
            total_chase: chaseTotal,
            total_euro: euroTotal,
            remaining_balance: remainingBalance,
            year: currentYear
          });

        if (insertError) throw insertError;
        toast.success(`Budget for ${currentMonth} has been closed`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error closing month:", error);
      toast.error("Failed to close month. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Close Budget for {currentMonth}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p>
            Are you sure you want to close the budget for {currentMonth}? This will save the following values to your budget history:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <span>Income:</span>
              <span className="font-semibold">${income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span className="font-semibold text-red-600">${expenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Savings:</span>
              <span className="font-semibold">${savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance:</span>
              <span className="font-semibold text-green-600">${(income - expenses).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span>Apple Total:</span>
              <span className="font-semibold">${appleTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Chase Total:</span>
              <span className="font-semibold">${chaseTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Euro Total:</span>
              <span className="font-semibold">${euroTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCloseMonth} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm & Close Month"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseMonthDialog;
